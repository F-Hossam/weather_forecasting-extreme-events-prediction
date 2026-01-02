import argparse
import json
import pandas as pd
from datetime import datetime, timedelta, timezone
from pathlib import Path
from meteostat import Point, daily

# PATHS
LOCATIONS_PATH = "./locations.json"

# LOAD LOCATIONS
def load_locations():
    with open(LOCATIONS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# FETCH YESTERDAY (METEOSTAT)
def fetch_yesterday_weather(lat: float, lon: float):
    yesterday = datetime.now(timezone.utc).date() - timedelta(days=1)

    location = Point(lat, lon)
    data = daily(location, start=yesterday, end=yesterday)

    if data.empty:
        raise RuntimeError("No data returned by Meteostat")

    return data.iloc[0], yesterday


# MAP TO YOUR CSV SCHEMA
def map_to_observation(row, date):
    return {
        "date": date,
        "mean_temperature": row["tavg"],
        "max_temperature": row["tmax"],
        "min_temperature": row["tmin"],
        "mean_dewPoint": row["dwpt"],
        "total_precipitation": row["prcp"],
        # Meteostat wind speed is km/h → convert to m/s
        "mean_windSpeed": row["wspd"] / 3.6 if pd.notna(row["wspd"]) else None,
        # Visibility already in km (may be NaN)
        "mean_visibility": row["visib"],
    }


# APPEND TO CSV (SAFE)
def append_observation(row, data_path: Path):
    df_new = pd.DataFrame([row])
    df_new["date"] = pd.to_datetime(df_new["date"])

    if data_path.exists():
        df = pd.read_csv(data_path, parse_dates=["date"])

        if row["date"] in df["date"].values:
            print(f"[INFO] Data for {row['date']} already exists. Skipping.")
            return

        df = pd.concat([df, df_new], ignore_index=True)
    else:
        df = df_new

    df = df.sort_values("date")
    df.to_csv(data_path, index=False)
    print(f"[OK] Weather data for {row['date']} appended.")


# MAIN (CLI)
def main():
    parser = argparse.ArgumentParser(description="Fetch yesterday's weather using Meteostat")
    parser.add_argument(
        "--location",
        required=True,
        help="Location name from locations.json (casablanca/sale/benimellal)"
    )

    args = parser.parse_args()

    locations = load_locations()

    if args.location not in locations:
        raise ValueError(
            f"Unknown location '{args.location}'. "
            f"Available: {list(locations.keys())}"
        )

    lat = locations[args.location]["LATITUDE"]
    lon = locations[args.location]["LONGITUDE"]
    data_path = f"../knoweldge_system/artifacts/{args.location}"

    meteo_row, date = fetch_yesterday_weather(lat, lon)
    obs = map_to_observation(meteo_row, date)

    append_observation(obs, data_path)



if __name__ == "__main__":
    main()