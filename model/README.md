Model folder overview
=====================

This folder contains the data prep notebook, trained artifacts, and the
inference/forecasting scripts.

Subfolders
----------
- building_model: Data preparation notebook(s) used to build the training
  dataset and models.
- building_model/datasets: Raw CSV inputs per city used during training.
- knoweldge_system: Inference-time code and artifacts used to run forecasts.
- knoweldge_system/artifacts: Per-location model assets and the historical
  `weather.csv` used for inference.
- retrieve_data: Data ingestion script(s) and location metadata for pulling
  fresh observations.

Python files (inputs/outputs and usage)
--------------------------------------

model/retrieve_data/fetch_historical.py
- Purpose: Fetch yesterday's weather from Meteostat and append it to the local
  historical dataset for a chosen location.
- Inputs:
  - city name (casablanca, sale, benimellal).
  - Meteostat daily data for yesterday (network call).
- Outputs:
  - Appends a new row to the location's historical CSV in
    `model/knoweldge_system/artifacts/<location>/weather.csv`.
  - Prints status messages to stdout.

model/knoweldge_system/run_forecast.py
- Purpose: Run the trained LSTM model to produce a 7-day forecast and detect
  extreme events.
- Inputs:
  - city name
  - `best_lstm_model.pt`, `feature_scaler_bundle.pkl`, `target_scalers.pkl`,
    and `weather.csv` in that artifact folder.
- Outputs:
  - A Python dict (printed to stdout in CLI mode) with:
    - `metadata` (model name, horizon, generation timestamp)
    - `forecast` (per-day values with units)
    - `events` (extreme event detections)
    - Example:
      ```json
      {
        "metadata": {
          "model": "WeatherLSTM",
          "horizon_days": 7,
          "generated_at": "2026-01-03T11:52:42.095474Z"
        },
        "forecast": [
          {
            "date": "2025-08-25",
            "mean_temperature": { "value": 23.22, "unit": "C" },
            "max_temperature": { "value": 27.85, "unit": "C" },
            "min_temperature": { "value": 18.10, "unit": "C" },
            "total_precipitation": { "value": 0.00, "unit": "mm" },
            "mean_windSpeed": { "value": 2.07, "unit": "m/s" },
            "mean_dewPoint": { "value": 18.96, "unit": "C" },
            "mean_visibility": { "value": 6.16, "unit": "km" }
          }
        ],
        "events": {
          "summary": {
            "total_events": 1,
            "severity_distribution": {
              "MODERATE": 1
            },
            "severity_score": 2,
            "event_types": {
              "Dry Spell": 1
            },
            "event_categories": {
              "Drought": 1
            },
            "max_severity": "MODERATE",
            "high_risk_days": [
              
            ],
            "most_affected_days": [
              
            ],
            "event_timeline": [
              {
                "date": "2025-08-25 to 2025-08-31",
                "event_id": "dry_spell",
                "type": "Dry Spell",
                "severity": "MODERATE",
                "category": "Drought"
              }
            ],
            "detailed_events": [
              {
                "date": "2025-08-25 to 2025-08-31",
                "event_id": "dry_spell",
                "type": "Dry Spell",
                "description": "Dry spell: 7 consecutive days without rain",
                "severity": "MODERATE",
                "confidence": "HIGH",
                "category": "Drought",
                "source": "7+ dry days impacts agriculture",
                "criteria": {
                  "duration_days": 7,
                  "total_precipitation_mm": -1.6800000000000002
                }
              }
            ],
            "statistics": {
              "extreme_events": 0,
              "high_severity_events": 0,
              "moderate_severity_events": 1,
              "low_severity_events": 0,
              "heat_related": 0,
              "cold_related": 0,
              "precipitation_related": 0,
              "wind_related": 0,
              "compound_events": 0,
              "drought_related": 1,
              "visibility_related": 0
            }
          },
          "recommendations": [
            "💧 DROUGHT: Conserve water, monitor crop irrigation, follow local water restrictions."
          ]
        }
      }
      ```

model/knoweldge_system/helpers.py
- Purpose: Shared model, preprocessing, scaling, and event-detection helpers
  used by `run_forecast.py`.
- Inputs:
  - Weather history DataFrame (loaded from `weather.csv`).
  - Feature/target scalers and model weights loaded from the artifact folder.
  - Forecast list in the format built by `run_forecast.py`.
- Outputs:
  - Returns values for each helper (model instance, engineered features,
    scaled/unscaled arrays, detected events).
- How used:
  - Imported by `run_forecast.py`; not meant to be run directly.
