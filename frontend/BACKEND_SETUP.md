# WeatherPredict - Backend Integration Guide

## Environment Setup

To connect this frontend to your backend API, you need to set the API URL environment variable.

### Option 1: Local Development (Recommended)

If your backend is running on `http://localhost:8000`, add this environment variable:

**In v0 Vars Section:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Option 2: Production/Deployed Backend

Replace the URL with your deployed backend:

```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## API Endpoints

The frontend expects the following endpoints from your backend:

### 1. Forecast Endpoint
```
GET /forecast?city={city_name}
```

**Response Format:**
```json
{
  "metadata": {
    "model": "WeatherLSTM",
    "horizon_days": 7,
    "generated_at": "2024-01-24T..."
  },
  "forecast": [
    {
      "date": "2024-01-24",
      "mean_temperature": { "value": 23.22, "unit": "°C" },
      "max_temperature": { "value": 27.85, "unit": "°C" },
      "min_temperature": { "value": 18.1, "unit": "°C" },
      "total_precipitation": { "value": 0.5, "unit": "mm" },
      "mean_windSpeed": { "value": 2.07, "unit": "m/s" },
      "mean_dewPoint": { "value": 18.96, "unit": "°C" },
      "mean_visibility": { "value": 6.16, "unit": "km" },
      "events": [
        {
          "date": "2024-01-24",
          "event_id": "event_1",
          "type": "Heavy Rainfall",
          "severity": "MODERATE",
          "category": "Precipitation",
          "description": "Heavy rainfall expected",
          "confidence": "HIGH"
        }
      ]
    }
  ],
  "events": [
    {
      "total_events": 2,
      "severity_distribution": { "MODERATE": 2 },
      "severity_score": 2,
      "event_types": { "Heavy Rainfall": 1 },
      "event_categories": { "Precipitation": 1 },
      "max_severity": "MODERATE",
      "high_risk_days": [],
      "most_affected_days": [],
      "event_timeline": [...],
      "detailed_events": [...],
      "statistics": {...}
    }
  ]
}
```

### 2. Current Weather Endpoint (Optional)
```
GET /current?city={city_name}
```

### 3. Alerts Endpoint (Optional)
```
GET /alerts
```

## API Integration Files

- `/lib/api.ts` - API service with TypeScript types and helper functions
- `/lib/cities.ts` - List of supported cities
- `/app/weather/page.tsx` - Weather dashboard (uses forecast endpoint)
- `/app/alerts/page.tsx` - Alerts page (uses forecast endpoint for each city)

## Troubleshooting

### CORS Issues

If you get CORS errors, ensure your backend has proper CORS headers:

```python
# Example Flask/FastAPI setup
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Network Errors

1. Check that backend is running on the correct port
2. Verify `NEXT_PUBLIC_API_URL` is set correctly in environment variables
3. Check browser console for specific error messages

## Frontend Features

### Weather Dashboard (`/weather`)
- City selection modal
- Real-time weather data display
- 7-day forecast with daily details
- Extreme weather alerts from API
- Model prediction insights

### Alerts Page (`/alerts`)
- Global alerts for all cities
- Alert summary statistics
- City-by-city alert breakdown
- Severity-based color coding

### Home Page (`/`)
- Landing page explaining the service
- Navigation to weather and alerts pages
