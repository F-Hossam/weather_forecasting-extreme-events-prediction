# 🌦️ Weather Forecast & Extreme Event Detection API

A **FastAPI-based weather forecasting system** that combines **Deep Learning (LSTM)** with **Knowledge Engineering (rule-based reasoning)** to predict meteorological variables and automatically detect **extreme weather events** in Moroccan cities.

---

## 📌 Overview

This API provides:

- 📈 **7-day weather forecasts** using city-specific LSTM models  
- 🧠 **Knowledge-based extreme event detection** (heat waves, droughts, storms, etc.)  
- 🚨 **Risk summaries and safety recommendations** generated automatically  
- 🏙️ Support for multiple cities, each with its own trained model and artifacts  

Currently supported cities:
- Casablanca
- Beni Mellal
- Salé

---

## 🏗️ Architecture (High-Level)

```
Request (city_name)
        │
        ▼
Load city-specific artifacts
        │
        ▼
LSTM Forecast (7 days)
        │
        ▼
Inverse scaling + JSON formatting
        │
        ▼
Knowledge-based rule engine
        │
        ▼
Extreme events + summaries + recommendations
        │
        ▼
JSON Response
```

---

## 🚀 API Endpoints

### 🔍 Health Check

**GET** `/health`

Returns API status.

```json
{
  "status": "ok"
}
```

---

### 🌤️ Weather Forecast & Extreme Events

**POST** `/forecast`

Generates a **7-day forecast** and detects **extreme weather events** using a rule-based knowledge system.

#### Request Body

```json
{
  "city_name": "casablanca"
}
```

- `city_name` *(string, required)*  
  One of: `casablanca`, `benimellal`, `sale`

---

## ⚙️ How the `/forecast` Endpoint Works

### 1️⃣ City & Artifact Resolution
- Validates the requested city.
- Loads city-specific artifacts:
  - Trained LSTM model
  - Feature scalers
  - Target scalers
  - Historical weather data

### 2️⃣ Time-Series Forecasting (Deep Learning)
- Builds the last LOOKBACK-day sequence.
- Predicts the next 7 days using an LSTM model.
- Inverse-scales predictions to real-world units.

### 3️⃣ Knowledge-Based Extreme Event Detection
- Applies expert-defined meteorological rules.
- Detects single-day and multi-day extreme events.
- Handles compound events and deduplicates overlaps.

### 4️⃣ Event Summarization & Recommendations
- Generates severity statistics.
- Builds an event timeline.
- Produces human-readable safety recommendations.

---

## 📦 Response Structure

```json
{
  "metadata": { ... },
  "forecast": [ ... ],
  "events": [ summary, recommendations ]
}
```

---

## 🔹 Metadata

```json
{
  "model": "WeatherLSTM",
  "horizon_days": 7,
  "generated_at": "2026-01-23T20:02:18.796899Z"
}
```

---

## 🔹 Forecast (Per Day)

Each day includes predicted variables with units and detected events.

```json
{
  "date": "2025-08-25",
  "mean_temperature": { "value": 23.22, "unit": "°C" },
  "max_temperature": { "value": 27.85, "unit": "°C" },
  "min_temperature": { "value": 18.1, "unit": "°C" },
  "total_precipitation": { "value": -0.19, "unit": "mm" },
  "mean_windSpeed": { "value": 2.07, "unit": "m/s" },
  "mean_dewPoint": { "value": 18.96, "unit": "°C" },
  "mean_visibility": { "value": 6.16, "unit": "km" },
  "events": []
}
```

---

## 🔹 Events (Global Analysis)

### Event Summary

Provides statistics, timelines, and severity distribution.

### Recommendations

Human-readable safety advice generated automatically based on detected events.

---

## 🧠 Knowledge Engineering

- Rule-based system inspired by Moroccan meteorological standards
- Supports extreme, compound, and multi-day events
- Ensures explainability with criteria and sources

---

## 🛡️ Error Handling

- **400**: Unknown city  
- **404**: Missing artifacts  
- **500**: Internal server error  

---

## 📚 Use Cases

- Climate risk monitoring
- Early warning systems
- Decision-support dashboards
- Academic and research projects


# Sample Case

```json
{
  "metadata": {
    "model": "WeatherLSTM",
    "horizon_days": 7,
    "generated_at": "2026-01-23T20:02:18.796899Z"
  },
  "forecast": [
    {
      "date": "2025-08-25",
      "mean_temperature": {
        "value": 23.22,
        "unit": "°C"
      },
      "max_temperature": {
        "value": 27.85,
        "unit": "°C"
      },
      "min_temperature": {
        "value": 18.1,
        "unit": "°C"
      },
      "total_precipitation": {
        "value": -0.19,
        "unit": "mm"
      },
      "mean_windSpeed": {
        "value": 2.07,
        "unit": "m/s"
      },
      "mean_dewPoint": {
        "value": 18.96,
        "unit": "°C"
      },
      "mean_visibility": {
        "value": 6.16,
        "unit": "km"
      },
      "events": []
    },
    {
      "date": "2025-08-26",
      "mean_temperature": {
        "value": 23.25,
        "unit": "°C"
      },
      "max_temperature": {
        "value": 27.69,
        "unit": "°C"
      },
      "min_temperature": {
        "value": 18.2,
        "unit": "°C"
      },
      "total_precipitation": {
        "value": -0.36,
        "unit": "mm"
      },
      "mean_windSpeed": {
        "value": 2.09,
        "unit": "m/s"
      },
      "mean_dewPoint": {
        "value": 18.99,
        "unit": "°C"
      },
      "mean_visibility": {
        "value": 5.2,
        "unit": "km"
      },
      "events": []
    },
    {
      "date": "2025-08-27",
      "mean_temperature": {
        "value": 23.03,
        "unit": "°C"
      },
      "max_temperature": {
        "value": 28.1,
        "unit": "°C"
      },
      "min_temperature": {
        "value": 17.83,
        "unit": "°C"
      },
      "total_precipitation": {
        "value": 0.07,
        "unit": "mm"
      },
      "mean_windSpeed": {
        "value": 2.11,
        "unit": "m/s"
      },
      "mean_dewPoint": {
        "value": 18.82,
        "unit": "°C"
      },
      "mean_visibility": {
        "value": 5.48,
        "unit": "km"
      },
      "events": []
    },
    {
      "date": "2025-08-28",
      "mean_temperature": {
        "value": 23.17,
        "unit": "°C"
      },
      "max_temperature": {
        "value": 27.98,
        "unit": "°C"
      },
      "min_temperature": {
        "value": 17.66,
        "unit": "°C"
      },
      "total_precipitation": {
        "value": -0.3,
        "unit": "mm"
      },
      "mean_windSpeed": {
        "value": 2.1,
        "unit": "m/s"
      },
      "mean_dewPoint": {
        "value": 18.75,
        "unit": "°C"
      },
      "mean_visibility": {
        "value": 5.49,
        "unit": "km"
      },
      "events": []
    },
    {
      "date": "2025-08-29",
      "mean_temperature": {
        "value": 22.81,
        "unit": "°C"
      },
      "max_temperature": {
        "value": 27.68,
        "unit": "°C"
      },
      "min_temperature": {
        "value": 17.45,
        "unit": "°C"
      },
      "total_precipitation": {
        "value": -0.57,
        "unit": "mm"
      },
      "mean_windSpeed": {
        "value": 2.07,
        "unit": "m/s"
      },
      "mean_dewPoint": {
        "value": 18.61,
        "unit": "°C"
      },
      "mean_visibility": {
        "value": 6.9,
        "unit": "km"
      },
      "events": []
    },
    {
      "date": "2025-08-30",
      "mean_temperature": {
        "value": 22.87,
        "unit": "°C"
      },
      "max_temperature": {
        "value": 27.79,
        "unit": "°C"
      },
      "min_temperature": {
        "value": 17.81,
        "unit": "°C"
      },
      "total_precipitation": {
        "value": -0.24,
        "unit": "mm"
      },
      "mean_windSpeed": {
        "value": 2.11,
        "unit": "m/s"
      },
      "mean_dewPoint": {
        "value": 18.76,
        "unit": "°C"
      },
      "mean_visibility": {
        "value": 4.7,
        "unit": "km"
      },
      "events": []
    },
    {
      "date": "2025-08-31",
      "mean_temperature": {
        "value": 22.88,
        "unit": "°C"
      },
      "max_temperature": {
        "value": 27.87,
        "unit": "°C"
      },
      "min_temperature": {
        "value": 17.64,
        "unit": "°C"
      },
      "total_precipitation": {
        "value": -0.09,
        "unit": "mm"
      },
      "mean_windSpeed": {
        "value": 2.06,
        "unit": "m/s"
      },
      "mean_dewPoint": {
        "value": 18.8,
        "unit": "°C"
      },
      "mean_visibility": {
        "value": 7.24,
        "unit": "km"
      },
      "events": []
    }
  ],
  "events": [
    {
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
      "high_risk_days": [],
      "most_affected_days": [],
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
            "total_precipitation_mm": -1.68
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
    [
      "💧 DROUGHT: Conserve water, monitor crop irrigation, follow local water restrictions."
    ]
  ]
}
```