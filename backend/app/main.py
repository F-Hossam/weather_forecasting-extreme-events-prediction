from __future__ import annotations

import asyncio
import json
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

REPO_ROOT = Path(__file__).resolve().parents[2]
MODEL_DIR = REPO_ROOT / "model"
if str(MODEL_DIR) not in sys.path:
    sys.path.insert(0, str(MODEL_DIR))

from model.knowledge_system.run_forecast import run_forecast  # noqa: E402

ARTIFACTS_DIR = MODEL_DIR / "knowledge_system" / "artifacts"
ARTIFACTS = {
    "casablanca": ARTIFACTS_DIR / "casablanca",
    "benimellal": ARTIFACTS_DIR / "benimellal",
    "sale": ARTIFACTS_DIR / "sale",
}

CACHE_TTL_SECONDS = int(os.getenv("FORECAST_CACHE_TTL", "60"))
STREAM_INTERVAL_DEFAULT = float(os.getenv("STREAM_INTERVAL_SEC", "5"))

_cache: Dict[str, Dict[str, Any]] = {}

app = FastAPI(
    title="Weather Forecast & Extreme Event API",
    description="LSTM-based weather forecasting with rule-based extreme event detection",
    version="1.1.0",
)

cors_origins_env = os.getenv("CORS_ORIGINS", "http://172.20.10.2:3000")
cors_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ForecastRequest(BaseModel):
    city_name: str


class ForecastResponse(BaseModel):
    metadata: Dict[str, Any]
    forecast: list[Dict[str, Any]]
    events: Any


def _normalize_city(city_name: str) -> str:
    return city_name.strip().lower()


def _get_artifact_path(city_name: str) -> Path:
    if city_name not in ARTIFACTS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown city '{city_name}'. Available: {list(ARTIFACTS.keys())}",
        )
    artifact_path = ARTIFACTS[city_name]
    if not artifact_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Artifact path not found: {artifact_path}",
        )
    return artifact_path


def _get_forecast(city_name: str) -> Dict[str, Any]:
    now = time.time()
    cached = _cache.get(city_name)
    if cached and now - cached["ts"] < CACHE_TTL_SECONDS:
        return cached["data"]

    artifact_path = _get_artifact_path(city_name)
    data = run_forecast(str(artifact_path))
    _cache[city_name] = {"ts": now, "data": data}
    return data


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/cities")
def cities() -> Dict[str, list[str]]:
    return {"cities": sorted(ARTIFACTS.keys())}


@app.post("/forecast", response_model=ForecastResponse)
def forecast(req: ForecastRequest) -> ForecastResponse:
    city_name = _normalize_city(req.city_name)
    data = _get_forecast(city_name)
    return ForecastResponse(**data)


@app.get("/realtime")
async def realtime(
    city_name: str = Query(..., description="City name to stream"),
    interval: float = Query(
        STREAM_INTERVAL_DEFAULT,
        ge=1,
        le=60,
        description="Seconds between updates",
    ),
) -> StreamingResponse:
    city = _normalize_city(city_name)
    _get_artifact_path(city)

    async def event_stream():
        while True:
            data = _get_forecast(city)
            current = data["forecast"][0] if data.get("forecast") else None
            payload = {
                "city": city,
                "generated_at": data["metadata"]["generated_at"],
                "current": current,
                "events_summary": data["events"][0] if data.get("events") else None,
            }
            yield f"data: {json.dumps(payload)}\n\n"
            await asyncio.sleep(interval)

    headers = {
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
    }
    return StreamingResponse(event_stream(), media_type="text/event-stream", headers=headers)
