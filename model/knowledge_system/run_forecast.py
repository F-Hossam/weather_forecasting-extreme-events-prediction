import torch
from datetime import timedelta, datetime, timezone
from knowledge_system.helpers import load_model, load_weather_data, inverse_scale_predictions, build_last_sequence, TARGET_COLS, TARGET_UNITS, HORIZON, LOOKBACK
from knowledge_system.predict_extreme import integrate_events_into_forecast
import joblib

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

def run_forecast(artifact_path):
    # ---- Load artifacts
    feature_bundle = joblib.load(f"{artifact_path}/feature_scaler_bundle.pkl")
    feature_scaler = feature_bundle["scaler"]
    feature_cols = feature_bundle["feature_cols"]
    target_scalers = joblib.load(f"{artifact_path}/target_scalers.pkl")

    model = load_model(input_size=len(feature_cols), model_path=f"{artifact_path}/best_lstm_model.pt")
    
    df = load_weather_data(f"{artifact_path}/weather.csv")

    # ---- Build input
    X_last = build_last_sequence(
        df,
        feature_cols,
        feature_scaler,
        LOOKBACK
    )
    X_last = X_last.to(DEVICE)

    # ---- Predict
    with torch.no_grad():
        Y_scaled = model(X_last).cpu().numpy()

    Y_real = inverse_scale_predictions(Y_scaled, target_scalers)
    Y_real = Y_real.reshape(HORIZON, len(TARGET_COLS))

    # ---- Build dates
    start_date = df.index.max() + timedelta(days=1)
    forecast_dates = [
        start_date + timedelta(days=i)
        for i in range(HORIZON)
    ]

    # ---- Build JSON
    forecast = []
    for i, date in enumerate(forecast_dates):
        day = {
            "date": date.strftime("%Y-%m-%d")
        }
        for j, var in enumerate(TARGET_COLS):
            value = round(float(Y_real[i, j]), 2)
            day[var] = {
                "value": 0 if value < 0 else value,
                "unit": TARGET_UNITS[var]
            }
        forecast.append(day)

    events = integrate_events_into_forecast(forecast)

    return {
        "metadata": {
            "model": "WeatherLSTM",
            "horizon_days": HORIZON,
            "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        },
        "forecast": forecast,
        "events": events  # filled by predict_extreme.py
    }
