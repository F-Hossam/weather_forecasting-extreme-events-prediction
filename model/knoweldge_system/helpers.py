import pandas as pd
import torch
import torch
import torch.nn as nn
import numpy as np
import warnings
from sklearn.exceptions import InconsistentVersionWarning
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

LOOKBACK = 14
HORIZON = 7

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

TARGET_COLS = [
    "mean_temperature",
    "max_temperature",
    "min_temperature",
    "total_precipitation",
    "mean_windSpeed",
    "mean_dewPoint",
    "mean_visibility",
]

TARGET_UNITS = {
    "mean_temperature": "°C",
    "max_temperature": "°C",
    "min_temperature": "°C",
    "total_precipitation": "mm",
    "mean_windSpeed": "m/s",
    "mean_dewPoint": "°C",
    "mean_visibility": "km",
}

class WeatherLSTM(nn.Module):
    def __init__(
        self,
        input_size,
        hidden_size=64,
        num_layers=2,
        horizon=7,
        num_targets=7,
        dropout=0.2
    ):
        super().__init__()

        self.horizon = horizon
        self.num_targets = num_targets
        self.output_size = horizon * num_targets

        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0
        )

        self.fc = nn.Linear(hidden_size, self.output_size)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        last_step = lstm_out[:, -1, :]
        out = self.fc(last_step)
        return out


# LOAD MODEL
def load_model(input_size: int, model_path):  
    model = WeatherLSTM(
        input_size=input_size,
        horizon=HORIZON,
        num_targets=len(TARGET_COLS),
    )
    model.load_state_dict(torch.load(model_path, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    return model


# LOAD DATA
def load_weather_data(path):
    df = df = pd.read_csv(
        path,
        index_col=0,
        parse_dates=True
    )

    # Case 1: DATE column exists
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"])
        df = df.set_index("date")

    # Case 2: already indexed, but as string
    else:
        df.index = pd.to_datetime(df.index)

    df = df.sort_index()
    return df


# FEATURE ENGINEERING
def apply_feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df = df.sort_index()

    # --------------------
    # Temporal features
    # --------------------
    df["dow"] = df.index.dayofweek
    df["dow_sin"] = np.sin(2 * np.pi * df["dow"] / 7)
    df["dow_cos"] = np.cos(2 * np.pi * df["dow"] / 7)

    df["doy"] = df.index.dayofyear
    df["doy_sin"] = np.sin(2 * np.pi * df["doy"] / 365)
    df["doy_cos"] = np.cos(2 * np.pi * df["doy"] / 365)

    # --------------------
    # Lag features
    # --------------------
    for lag in [1, 3, 7]:
        df[f"mean_temperature_lag_{lag}"] = df["mean_temperature"].shift(lag)

    # --------------------
    # Rolling features
    # --------------------
    for w in [3, 7]:
        df[f"mean_temperature_roll_mean_{w}"] = (
            df["mean_temperature"]
            .rolling(w, min_periods=1)
            .mean()
        )

        df[f"total_precipitation_roll_sum_{w}"] = (
            df["total_precipitation"]
            .rolling(w, min_periods=1)
            .sum()
        )

    # --------------------
    # Change features
    # --------------------
    df["delta_temp_1d"] = df["mean_temperature"].diff(1)
    df["delta_temp_3d"] = df["mean_temperature"].diff(3)
    df["wind_increase_1d"] = df["mean_windSpeed"].diff(1)
    df["precip_increase_1d"] = df["total_precipitation"].diff(1)

    return df


# BUILD LAST INPUT SEQUENCE
def build_last_sequence(df, feature_cols, feature_scaler, lookback):
    df_fe = apply_feature_engineering(df)

    # take last LOOKBACK rows AFTER feature engineering
    X = df_fe.iloc[-lookback:][feature_cols]

    # safety check
    if X.isna().any().any():
        raise ValueError(
            "NaNs detected in inference window. "
            "Not enough historical data."
        )

    X_scaled = feature_scaler.transform(X.values)

    return torch.tensor(
        X_scaled, dtype=torch.float32
    ).unsqueeze(0)


# INVERSE SCALE OUTPUT
def inverse_scale_predictions(Y_scaled, target_scalers):
    Y_real = Y_scaled.copy()

    for i, var in enumerate(TARGET_COLS):
        start = i * HORIZON
        end   = (i + 1) * HORIZON

        Y_real[:, start:end] = target_scalers[var].inverse_transform(
            Y_scaled[:, start:end]
        )

    return Y_real