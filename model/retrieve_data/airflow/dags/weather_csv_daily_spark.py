
from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime

with DAG(
    dag_id="weather_csv_daily_spark",
    start_date=datetime(2024, 1, 1),
    schedule_interval="0 2 * * *",
    catchup=False,
    tags=["spark", "weather", "csv"],
) as dag:

    run_spark_job = BashOperator(
        task_id="spark_weather_update",
        bash_command="""
        spark-submit /producer/weather_csv_updater_spark.py
        """
    )
