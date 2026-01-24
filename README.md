## Project Overview

This repo is split into three main layers:

- `backend/` - Backend service code.
- `frontend/` - Frontend app.
- `model/` - Data/model pipeline:
  - `model/knoweldge_system/` - Inference artifacts and forecast runner.
  - `model/retrieve_data/` - Data fetcher that appends new observations.
  - `model/building_model/` - Training notebooks and datasets.

## Setup

1) Create and activate the virtual environment (Windows PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2) Install requirements:

```powershell
pip install -r requirements.txt
```

## Run: Knowledge System Forecast

Runs the LSTM forecast using the artifacts for a specific location.

```powershell
python .\model\knoweldge_system\run_forecast.py --artifact-path .\model\knoweldge_system\artifacts\casablanca
```

Available artifact folders include:

- `.\\model\\knoweldge_system\\artifacts\\casablanca`
- `.\\model\\knoweldge_system\\artifacts\\benimellal`
- `.\\model\\knoweldge_system\\artifacts\\sale`

## Run: Retrieve Data (Append New Observations)

Fetches yesterday's weather via Meteostat and appends the new row to the location dataset under `model/knowledge_system/artifacts/<location>/weather.csv`.

### Setup and Execution

Valid locations are defined in `model/retrieve_data/locations.json`.

To retrieve data, follow these steps:

1. **Navigate to the retrieve_data directory:**
```bash
   cd model/retrieve_data
```

2. **Build the Docker containers:**
```bash
   docker compose build
```

3. **Start the services:**
```bash
   docker compose up -d
```

4. **Set permissions for the knowledge_system directory:**
```bash
   chmod -R 777 ../knowledge_system/
```

5. **Monitor the Airflow tasks:**
   Open your browser and navigate to:
```
   username = admin
   password = admin
   http://localhost:8080
```
Here you can monitor the scheduled tasks and their execution status.

### Notes
- The data retrieval process is automated via Airflow DAGs
- Weather data is fetched using Spark jobs defined in `producer/weather_csv_updater_spark.py`
- The Airflow DAG configuration can be found in `airflow/dags/weather_csv_daily_spark.py`
- Retrieved data is stored in `model/knowledge_system/artifacts/<location>/weather.csv`