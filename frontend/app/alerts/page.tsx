'use client';

import Link from 'next/link';
import { Cloud, AlertTriangle, MapPin, AlertCircle, TrendingUp, Wind, Droplets, Flame } from 'lucide-react';
import { POPULAR_CITIES } from '@/lib/cities';

const CITY_ALERTS = POPULAR_CITIES.slice(0, 6).map((city, idx) => ({
  city: city.name,
  country: city.country,
  severity: ['extreme', 'high', 'moderate', 'low'][idx % 4] as const,
  alerts: [
    { type: 'Weather Event', probability: `${45 + idx * 8}%`, icon: '🌦️' },
    ...(idx % 2 === 0 ? [{ type: 'Secondary Alert', probability: `${30 + idx * 5}%`, icon: '⚠️' }] : []),
  ],
}));

export default function AlertsPage() {
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
            <span className="text-xl font-bold text-foreground">WeatherPredict</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/weather" className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:border-primary/50 transition">
              Dashboard
            </Link>
            <Link href="/" className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition">
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 sm:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Global Weather Alerts</h1>
            </div>
            <p className="text-lg text-muted-foreground">Real-time severe weather notifications across all monitored cities</p>
          </div>

          {/* Alert Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-destructive/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-muted-foreground text-sm">High Risk Cities</p>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {CITY_ALERTS.filter((c) => c.severity === 'high').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-muted-foreground text-sm">Medium Risk</p>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {CITY_ALERTS.filter((c) => c.severity === 'medium').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Wind className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-muted-foreground text-sm">Total Cities</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{CITY_ALERTS.length}</p>
            </div>
          </div>

          {/* City Alerts Grid */}
          <div className="space-y-6">
            {CITY_ALERTS.map((cityData) => (
              <div key={cityData.city} className={`border-l-4 rounded-xl p-6 sm:p-8 transition ${severityColor(cityData.severity)}`}>
                {/* City Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{cityData.city}</h3>
                      <p className="text-muted-foreground">{cityData.country}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${severityBadgeColor(cityData.severity)}`}>
                    {severityLabel(cityData.severity)}
                  </span>
                </div>

                {/* Alerts List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cityData.alerts.map((alert, idx) => (
                    <div key={idx} className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-lg font-semibold text-foreground mb-1">{alert.type}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: alert.probability }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-foreground">{alert.probability}</span>
                          </div>
                        </div>
                        <span className="text-3xl">{alert.icon}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Alert Legend */}
          <div className="mt-12 p-8 bg-card border border-border rounded-xl">
            <h4 className="text-lg font-bold text-foreground mb-6">Alert Categories</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <Flame className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Heat Events</p>
                  <p className="text-sm text-muted-foreground">Heat waves and extreme temperatures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Droplets className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Water Hazards</p>
                  <p className="text-sm text-muted-foreground">Rainfall, flooding, and flooding risks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wind className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Wind Events</p>
                  <p className="text-sm text-muted-foreground">Strong winds and storm systems</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 p-8 bg-primary/10 border border-primary/30 rounded-xl text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">Stay Informed</h3>
            <p className="text-muted-foreground mb-6">
              Get real-time notifications for severe weather events in your selected cities
            </p>
            <Link
              href="/weather"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              View Weather Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
