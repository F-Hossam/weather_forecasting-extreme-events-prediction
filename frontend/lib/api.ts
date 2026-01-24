// api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/* =========================
   Types (aligned with backend)
   ========================= */

export interface ForecastResponse {
  metadata: {
    model: string;
    horizon_days: number;
    generated_at: string;
  };
  forecast: Array<{
    date: string;
    mean_temperature: { value: number; unit: string };
    max_temperature: { value: number; unit: string };
    min_temperature: { value: number; unit: string };
    total_precipitation: { value: number; unit: string };
    mean_windSpeed: { value: number; unit: string };
    mean_dewPoint: { value: number; unit: string };
    mean_visibility: { value: number; unit: string };
  }>;
  events: Array<{
    total_events: number;
    severity_distribution: Record<string, number>;
    severity_score: number;
    event_types: Record<string, number>;
    event_categories: Record<string, number>;
    max_severity: string;
    high_risk_days: string[];
    most_affected_days: string[];
    event_timeline: Array<{
      date?: string;
      event_id: string;
      type: string;
      severity: string;
      category: string;
      description?: string;
      confidence?: string;
    }>;
    detailed_events: Array<{
      date?: string;
      event_id: string;
      type: string;
      severity: string;
      category: string;
      description?: string;
      confidence?: string;
    }>;
    statistics: Record<string, number>;
  }>;
}

/* =========================
   Forecast (POST /forecast)
   ========================= */

export async function getForecast(city: string): Promise<ForecastResponse> {
  const response = await fetch(`${API_BASE_URL}/forecast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      city_name: city,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Forecast API error ${response.status}: ${text}`);
  }

  return response.json();
}

/* =========================
   Realtime (SSE /realtime)
   ========================= */

export interface RealtimePayload {
  city: string;
  generated_at: string;
  current: ForecastResponse['forecast'][0] | null;
  events_summary: ForecastResponse['events'][0] | null;
}

/**
 * Subscribe to realtime weather updates (Server-Sent Events)
 */
export function subscribeRealtime(
  city: string,
  onMessage: (data: RealtimePayload) => void,
  onError?: (error: Event) => void
): EventSource {
  const url = `${API_BASE_URL}/realtime?city_name=${encodeURIComponent(city)}`;

  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const data: RealtimePayload = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('[SSE] Parse error:', err);
    }
  };

  eventSource.onerror = (err) => {
    console.error('[SSE] Connection error:', err);
    if (onError) onError(err);
    eventSource.close();
  };

  return eventSource;
}

/* =========================
   Cities (GET /cities)
   ========================= */

export async function getCities(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/cities`);

  if (!response.ok) {
    throw new Error(`Cities API error: ${response.status}`);
  }

  const data = await response.json();
  return data.cities;
}

/* =========================
   Health check (GET /health)
   ========================= */

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}