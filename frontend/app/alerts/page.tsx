'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cloud,
  AlertTriangle,
  MapPin,
  AlertCircle,
  TrendingUp,
  Wind,
  Droplets,
  Flame,
} from 'lucide-react';

import { POPULAR_CITIES } from '@/lib/cities';
import { getForecast, type ForecastResponse } from '@/lib/api';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Record<string, ForecastResponse | null>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllAlerts = async () => {
      try {
        setLoading(true);
        const alertsData: Record<string, ForecastResponse | null> = {};

        for (const city of POPULAR_CITIES) {
          try {
            const data = await getForecast(city.name);
            alertsData[city.name] = data;
          } catch (err) {
            console.error(
              `[alerts] Failed to fetch alerts for ${city.name}:`,
              err
            );
            alertsData[city.name] = null;
          }
        }

        setAlerts(alertsData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch alerts'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllAlerts();
  }, []);

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-destructive/50 bg-destructive/5';
      case 'medium':
        return 'border-yellow-500/50 bg-yellow-500/5';
      default:
        return 'border-green-500/50 bg-green-500/5';
    }
  };

  const severityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'High Risk';
      case 'medium':
        return 'Medium Risk';
      default:
        return 'Low Risk';
    }
  };

  const severityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive/20 text-destructive';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      default:
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="px-6 sm:px-12 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Cloud className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">
              WeatherPredict
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/weather"
              className="px-4 py-2 bg-card border border-border rounded-lg"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 sm:px-12 py-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <h1 className="text-4xl font-bold">Global Weather Alerts</h1>
          </div>
          <p className="text-muted-foreground">
            Severe weather alerts per monitored city
          </p>
        </div>

        {loading && <p>Fetching alerts…</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!loading &&
          POPULAR_CITIES.map((city) => {
            const cityData = alerts[city.name];
            const events = cityData?.events?.[0];
            const detailed = events?.detailed_events ?? [];
            const hasAlerts = detailed.length > 0;

            const severity =
              events?.max_severity === 'HIGH'
                ? 'high'
                : events?.max_severity === 'MODERATE'
                ? 'medium'
                : 'low';

            return (
              <div
                key={city.name}
                className={`border-l-4 rounded-xl p-6 mb-6 ${severityColor(
                  severity
                )}`}
              >
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold">{city.name}</h3>
                      <p className="text-muted-foreground">
                        {city.country}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm ${severityBadgeColor(
                      severity
                    )}`}
                  >
                    {severityLabel(severity)}
                    {hasAlerts && ` (${detailed.length})`}
                  </span>
                </div>

                {hasAlerts ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {detailed.map((alert, idx) => (
                      <div
                        key={idx}
                        className="border rounded-lg p-4 bg-background"
                      >
                        <p className="font-semibold">{alert.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.description}
                        </p>
                        <p className="text-xs mt-1">
                          Confidence: {alert.confidence}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No severe alerts for this period
                  </p>
                )}
              </div>
            );
          })}
      </main>
    </div>
  );
}