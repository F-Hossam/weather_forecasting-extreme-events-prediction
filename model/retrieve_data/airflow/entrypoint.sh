#!/bin/bash
set -e

echo "Starting Airflow initialization..."

airflow db init

airflow users create \
    -u admin \
    -p admin \
    -f Admin \
    -l User \
    -r Admin \
    -e admin@test.com || true

echo "Starting Airflow scheduler in background..."
airflow scheduler &

echo "Starting Airflow webserver..."
exec airflow webserver
