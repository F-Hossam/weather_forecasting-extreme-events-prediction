import requests
import psycopg2
import time
from datetime import datetime, timedelta, UTC
import os

OPENWEATHER_API_KEY = os.getenv("OPENWEATHERAPIKEY")
DBUSER = os.getenv("DBUSER")
DBPASSWORD = os.getenv("DBPASSWORD")

# Casablanca coordinates
LAT = 33.5731
LON = -7.5898

POSTGRES_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "dbname": "weatherData",
    "user": DBUSER,
    "password": DBPASSWORD
}

START_DATE = datetime(2024, 1, 1)
END_DATE = datetime.now(UTC)

def get_db_connection():
    return psycopg2.connect(**POSTGRES_CONFIG)


def fetch_weather_for_day(timestamp: int) -> dict:
    url = "https://api.openweathermap.org/data/3.0/onecall/timemachine"
    
    params = {
        "lat": LAT,
        "lon": LON,
        "dt": timestamp,
        "units": "metric",
        "appid": OPENWEATHER_API_KEY
    }

    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()


def store_weather_data(cursor, weather_data: dict):
    current = weather_data["data"][0]

    date = datetime.fromtimestamp(current["dt"],UTC).date()
    temperature = current["temp"]
    humidity = current["humidity"]
    wind_speed = current["wind_speed"]
    pressure = current["pressure"]
    precipitation = current.get("rain", {}).get("1h", 0.0)

    query = """
        INSERT INTO weather_casablanca (
            date, temperature, humidity, wind_speed, pressure, precipitation
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (date) DO NOTHING;
    """

    cursor.execute(query, (
        date,
        temperature,
        humidity,
        wind_speed,
        pressure,
        precipitation
    ))


def ingest_historical_weather():
    conn = get_db_connection()
    cursor = conn.cursor()

    current_date = START_DATE

    while current_date <= END_DATE:
        print(f"Fetching data for {current_date.date()}")

        timestamp = int(current_date.timestamp())

        try:
            weather_data = fetch_weather_for_day(timestamp)
            store_weather_data(cursor, weather_data)
            conn.commit()

        except Exception as e:
            print(f"Error on {current_date.date()}: {e}")
            conn.rollback()

        # OpenWeather rate limit protection
        time.sleep(1)

        current_date += timedelta(days=1)

    cursor.close()
    conn.close()
    print("Historical data ingestion completed.")


if __name__ == "__main__":
    ingest_historical_weather()
