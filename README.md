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

Fetches yesterday's weather via Meteostat and appends the new row to the
location dataset under `model/knoweldge_system/artifacts/<location>/weather.csv`.

```powershell
python .\model\retrieve_data\fetch_historical.py --location casablanca
```

Valid locations are defined in `model/retrieve_data/locations.json`.
