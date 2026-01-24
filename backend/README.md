Backend service (FastAPI)
=========================

This backend exposes the trained model as a local API for the frontend.

Setup
-----
From the repo root:
1) Create and activate a virtual env (optional but recommended).
2) Install deps:
   - pip install -r backend/requirements.txt
3) Run the API:
   - uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Endpoints
---------
- GET /health
- GET /cities
- POST /forecast
  Body (JSON):
  - {"city_name": "casablanca"}
- GET /realtime?city_name=casablanca
  Server-sent events stream (SSE) for live updates.
  Query params:
  - interval: seconds between updates (default 5, min 1, max 60)

Configuration
-------------
- CORS_ORIGINS: comma-separated list of allowed origins.
  - Example: CORS_ORIGINS=http://localhost:3000
