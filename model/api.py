from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from pathlib import Path
from knowledge_system.run_forecast import run_forecast

BASE_DIR = Path(__file__).resolve().parent              # model/
KNOWLEDGE_DIR = BASE_DIR / "knowledge_system"           # model/knowledge_system
ARTIFACTS_DIR = KNOWLEDGE_DIR / "artifacts"             # model/knowledge_system/artifacts

ARTIFACTS = {
    "casablanca": ARTIFACTS_DIR / "casablanca",
    "benimellal": ARTIFACTS_DIR / "benimellal",
    "sale": ARTIFACTS_DIR / "sale",
}

app = FastAPI(
    title="Weather Forecast & Extreme Event API",
    description="LSTM-based weather forecasting with rule-based extreme event detection",
    version="1.0.0"
)


class ForecastRequest(BaseModel):
    city_name: str


class ForecastResponse(BaseModel):
    metadata: Dict[str, Any]
    forecast: list[Dict[str, Any]]
    events: Dict[str, Any]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/forecast", response_model=ForecastResponse)
def forecast(req: ForecastRequest):
    city_name = req.city_name.lower()

    if city_name not in ARTIFACTS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown city '{city_name}'. Available: {list(ARTIFACTS.keys())}"
        )

    artifact_path = ARTIFACTS[city_name]

    if not artifact_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Artifact path not found: {artifact_path}"
        )

    try:
        result = run_forecast(str(artifact_path))
        response = ForecastResponse(
            metadata=result["metadata"],
            forecast=result["forecast"],
            events=result["events"]
        )
        return response

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
