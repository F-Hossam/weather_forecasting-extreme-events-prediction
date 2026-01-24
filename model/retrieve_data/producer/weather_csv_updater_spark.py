import json
from datetime import datetime, timedelta, timezone, date, time
from pathlib import Path
import pandas as pd
from meteostat import Point, Hourly

from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, DoubleType, TimestampType, DateType
from pyspark.sql.functions import col, to_date, avg, max as spark_max, min as spark_min, sum as spark_sum, from_utc_timestamp

# --------------------
# PATHS & CONFIG
# --------------------
LOCATIONS_PATH = "/locations.json"
DATA_DIR = "/data"
CITIES_TO_UPDATE = ["benimellal", "casablanca", "sale"]

# --------------------
# SPARK SESSION
# --------------------
spark = (
    SparkSession.builder
    .master("local[*]")  # Use all cores
    .appName("WeatherHourlyToDailyUpdater")
    .getOrCreate()
)

spark.conf.set("spark.sql.session.timeZone", "UTC")

# --------------------
# UTILS
# --------------------
def to_datetime(d):
    if isinstance(d, datetime):
        return d
    if isinstance(d, date):
        return datetime.combine(d, time.min)
    raise ValueError(f"Unsupported date type: {type(d)}")

def load_locations():
    with open(LOCATIONS_PATH) as f:
        return json.load(f)

def get_last_date(csv_path: str) -> datetime:
    if not Path(csv_path).exists():
        return datetime(2024, 1, 1)

    df = spark.read.option("header", False).csv(csv_path)
    df = df.withColumn("date", col("_c0").cast(DateType()))
    max_date = df.select(spark_max("date")).collect()[0][0]

    if max_date is None:
        return datetime(2024, 1, 1)

    return datetime.combine(max_date, time.min) + timedelta(days=1)

def safe_value(x):
    return None if pd.isna(x) else x

# --------------------
# FETCH HOURLY DATA
# --------------------
def fetch_hourly_to_spark(lat: float, lon: float, start: datetime, end: datetime):
    point = Point(lat, lon)
    pdf = Hourly(point, start, end).fetch()

    if pdf.empty:
        return None

    rows = [
        (
            ts.to_pydatetime(),
            safe_value(row.get("temp")),
            safe_value(row.get("dwpt")),
            safe_value(row.get("prcp")),
            safe_value(row.get("wspd")) / 3.6 if safe_value(row.get("wspd")) is not None else None,  # km/h → m/s
            float(max(min((safe_value(row.get("temp")) - safe_value(row.get("dwpt"))) * 1.5, 10), 0))
            if safe_value(row.get("temp")) is not None and safe_value(row.get("dwpt")) is not None else None,
        )
        for ts, row in pdf.iterrows()
    ]

    schema = StructType([
        StructField("ts", TimestampType(), False),
        StructField("temp", DoubleType(), True),
        StructField("dwpt", DoubleType(), True),
        StructField("prcp", DoubleType(), True),
        StructField("wspd", DoubleType(), True),
        StructField("visib", DoubleType(), True),
    ])

    return spark.createDataFrame(rows, schema)

# --------------------
# UPDATE CITY
# --------------------
def update_city(city: str, coords: dict):
    csv_path = f"{DATA_DIR}/{city}/weather.csv"
    start = to_datetime(get_last_date(csv_path))
    end = to_datetime(datetime.now(timezone.utc).date() - timedelta(days=1))

    if start > end:
        print(f"[SKIP] {city} already up to date")
        return

    hourly_df = fetch_hourly_to_spark(coords["LATITUDE"], coords["LONGITUDE"], start, end)

    if hourly_df is None:
        print(f"[WARN] No hourly data for {city}")
        return

    # Convert UTC → Morocco time
    hourly_df = hourly_df.withColumn("ts_local", from_utc_timestamp(col("ts"), "Africa/Casablanca"))

    # Aggregate daily
    daily_df = (
        hourly_df
        .withColumn("date", to_date(col("ts_local")))
        .groupBy("date")
        .agg(
            avg("temp").alias("mean_temperature"),
            spark_max("temp").alias("max_temperature"),
            spark_min("temp").alias("min_temperature"),
            avg("dwpt").alias("mean_dewPoint"),
            spark_sum("prcp").alias("total_precipitation"),
            avg("wspd").alias("mean_windSpeed"),
            avg("visib").alias("mean_visibility"),
        )
    )

    pdf_new = daily_df.toPandas()
    pdf_new["date"] = pd.to_datetime(pdf_new["date"])
    pdf_new.set_index("date", inplace=True)

    # Merge with existing CSV
    if Path(csv_path).exists():
        pdf_existing = pd.read_csv(csv_path, index_col=0, parse_dates=True)
        pdf_final = pd.concat([pdf_existing, pdf_new])
    else:
        pdf_final = pdf_new

    pdf_final = pdf_final.sort_index()
    pdf_final = pdf_final[~pdf_final.index.duplicated(keep="last")]

    pdf_final.to_csv(csv_path)
    print(f"[OK] {city} updated successfully")

# --------------------
# MAIN
# --------------------
def run():
    locations = load_locations()
    for city in CITIES_TO_UPDATE:
        coords = locations.get(city)
        if coords:
            update_city(city, coords)
        else:
            print(f"[WARN] City {city} not found in locations.json")

if __name__ == "__main__":
    run()
