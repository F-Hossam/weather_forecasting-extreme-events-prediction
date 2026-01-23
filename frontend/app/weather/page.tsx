'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cloud, MapPin, Search, X, Droplets, Wind, Gauge, Sun, AlertTriangle, TrendingUp, CloudRain, Eye } from 'lucide-react';
import { POPULAR_CITIES } from '@/lib/cities';

interface ForecastDay {
  date: string;
  mean_temperature: { value: number; unit: string };
  max_temperature: { value: number; unit: string };
  min_temperature: { value: number; unit: string };
  total_precipitation: { value: number; unit: string };
  mean_windSpeed: { value: number; unit: string };
  mean_dewPoint: { value: number; unit: string };
  mean_visibility: { value: number; unit: string };
  events: Array<{
    date: string;
    event_id: string;
    type: string;
    severity: string;
    category: string;
    description: string;
    confidence: string;
  }>;
}

interface WeatherEvent {
  date?: string;
  event_id: string;
  type: string;
  severity: string;
  category: string;
  description?: string;
  confidence?: string;
}

interface ApiResponse {
  metadata: {
    model: string;
    horizon_days: number;
    generated_at: string;
  };
  forecast: ForecastDay[];
  events: Array<{
    total_events: number;
    severity_distribution: Record<string, number>;
    severity_score: number;
    event_types: Record<string, number>;
    event_categories: Record<string, number>;
    max_severity: string;
    high_risk_days: string[];
    most_affected_days: string[];
    event_timeline: WeatherEvent[];
    detailed_events: WeatherEvent[];
    statistics: Record<string, number>;
  }>;
}

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  feelsLike: number;
}

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [forecastData, setForecastData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const filteredCities = POPULAR_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName);
    setShowModal(false);
    setLoading(true);

    // Simulate API call with forecast data
    setTimeout(() => {
      const mockData: ApiResponse = {
        metadata: {
          model: 'WeatherLSTM',
          horizon_days: 7,
          generated_at: new Date().toISOString(),
        },
        forecast: [
          {
            date: new Date().toISOString().split('T')[0],
            mean_temperature: { value: 23.22, unit: '°C' },
            max_temperature: { value: 27.85, unit: '°C' },
            min_temperature: { value: 18.1, unit: '°C' },
            total_precipitation: { value: 0.5, unit: 'mm' },
            mean_windSpeed: { value: 2.07, unit: 'm/s' },
            mean_dewPoint: { value: 18.96, unit: '°C' },
            mean_visibility: { value: 6.16, unit: 'km' },
            events: [],
          },
          {
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            mean_temperature: { value: 23.25, unit: '°C' },
            max_temperature: { value: 27.69, unit: '°C' },
            min_temperature: { value: 18.2, unit: '°C' },
            total_precipitation: { value: 1.2, unit: 'mm' },
            mean_windSpeed: { value: 2.09, unit: 'm/s' },
            mean_dewPoint: { value: 18.99, unit: '°C' },
            mean_visibility: { value: 5.2, unit: 'km' },
            events: [],
          },
          {
            date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
            mean_temperature: { value: 23.03, unit: '°C' },
            max_temperature: { value: 28.1, unit: '°C' },
            min_temperature: { value: 17.83, unit: '°C' },
            total_precipitation: { value: 0.07, unit: 'mm' },
            mean_windSpeed: { value: 2.11, unit: 'm/s' },
            mean_dewPoint: { value: 18.82, unit: '°C' },
            mean_visibility: { value: 5.48, unit: 'km' },
            events: [],
          },
          {
            date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
            mean_temperature: { value: 23.17, unit: '°C' },
            max_temperature: { value: 27.98, unit: '°C' },
            min_temperature: { value: 17.66, unit: '°C' },
            total_precipitation: { value: 2.1, unit: 'mm' },
            mean_windSpeed: { value: 2.1, unit: 'm/s' },
            mean_dewPoint: { value: 18.75, unit: '°C' },
            mean_visibility: { value: 5.49, unit: 'km' },
            events: [
              {
                date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
                event_id: 'heavy_rain',
                type: 'Heavy Rainfall',
                severity: 'MODERATE',
                category: 'Precipitation',
                description: 'Heavy rainfall expected',
                confidence: 'HIGH',
              },
            ],
          },
          {
            date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
            mean_temperature: { value: 22.81, unit: '°C' },
            max_temperature: { value: 27.68, unit: '°C' },
            min_temperature: { value: 17.45, unit: '°C' },
            total_precipitation: { value: 0.0, unit: 'mm' },
            mean_windSpeed: { value: 2.07, unit: 'm/s' },
            mean_dewPoint: { value: 18.61, unit: '°C' },
            mean_visibility: { value: 6.9, unit: 'km' },
            events: [],
          },
          {
            date: new Date(Date.now() + 432000000).toISOString().split('T')[0],
            mean_temperature: { value: 22.87, unit: '°C' },
            max_temperature: { value: 27.79, unit: '°C' },
            min_temperature: { value: 17.81, unit: '°C' },
            total_precipitation: { value: 0.3, unit: 'mm' },
            mean_windSpeed: { value: 2.11, unit: 'm/s' },
            mean_dewPoint: { value: 18.76, unit: '°C' },
            mean_visibility: { value: 4.7, unit: 'km' },
            events: [],
          },
          {
            date: new Date(Date.now() + 518400000).toISOString().split('T')[0],
            mean_temperature: { value: 22.88, unit: '°C' },
            max_temperature: { value: 27.87, unit: '°C' },
            min_temperature: { value: 17.64, unit: '°C' },
            total_precipitation: { value: 0.8, unit: 'mm' },
            mean_windSpeed: { value: 2.06, unit: 'm/s' },
            mean_dewPoint: { value: 18.8, unit: '°C' },
            mean_visibility: { value: 7.24, unit: 'km' },
            events: [
              {
                date: new Date(Date.now() + 518400000).toISOString().split('T')[0],
                event_id: 'dry_spell',
                type: 'Dry Spell',
                severity: 'MODERATE',
                category: 'Drought',
                description: 'Extended dry period',
                confidence: 'HIGH',
              },
            ],
          },
        ],
        events: [
          {
            total_events: 2,
            severity_distribution: { MODERATE: 2 },
            severity_score: 2,
            event_types: { 'Heavy Rainfall': 1, 'Dry Spell': 1 },
            event_categories: { Precipitation: 1, Drought: 1 },
            max_severity: 'MODERATE',
            high_risk_days: [],
            most_affected_days: [],
            event_timeline: [
              {
                date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
                event_id: 'heavy_rain',
                type: 'Heavy Rainfall',
                severity: 'MODERATE',
                category: 'Precipitation',
              },
              {
                date: new Date(Date.now() + 518400000).toISOString().split('T')[0],
                event_id: 'dry_spell',
                type: 'Dry Spell',
                severity: 'MODERATE',
                category: 'Drought',
              },
            ],
            detailed_events: [
              {
                date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
                event_id: 'heavy_rain',
                type: 'Heavy Rainfall',
                severity: 'MODERATE',
                category: 'Precipitation',
                description: 'Heavy rainfall expected with 2.1 mm precipitation',
                confidence: 'HIGH',
              },
              {
                date: new Date(Date.now() + 518400000).toISOString().split('T')[0],
                event_id: 'dry_spell',
                type: 'Dry Spell',
                severity: 'MODERATE',
                category: 'Drought',
                description: 'Extended dry period risk',
                confidence: 'HIGH',
              },
            ],
            statistics: {
              extreme_events: 0,
              high_severity_events: 0,
              moderate_severity_events: 2,
              low_severity_events: 0,
            },
          },
        ],
      };
      setForecastData(mockData);
      setLoading(false);
    }, 800);
  };

  const handleChangeCity = () => {
    setShowModal(true);
    setSearchQuery('');
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
            <button
              onClick={handleChangeCity}
              className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:border-primary/50 transition"
            >
              Change City
            </button>
            <Link href="/alerts" className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition">
              Alerts
            </Link>
          </div>
        </div>
      </header>

      {/* City Selector Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 sm:p-8 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Select Your City</h2>
              <button
                onClick={() => {
                  if (selectedCity) setShowModal(false);
                }}
                className="p-2 hover:bg-muted rounded-lg transition"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <div className="p-6 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleSelectCity(city.name)}
                    className="p-4 bg-background border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition">{city.name}</p>
                        <p className="text-sm text-muted-foreground">{city.country}</p>
                      </div>
                      <MapPin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedCity && forecastData && !loading && (
        <main className="px-6 sm:px-12 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* City Header */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground flex items-center gap-3">
                <MapPin className="w-8 h-8 text-primary" />
                {selectedCity}
              </h1>
              <p className="text-muted-foreground mt-2">Real-time weather dashboard</p>
            </div>

            {/* Current Weather Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Weather Card */}
              <div className="lg:col-span-1 bg-primary/10 border border-primary/30 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Current Conditions</p>
                  <p className="text-5xl mb-2">☀️</p>
                </div>
                <div>
                  <div className="text-6xl font-bold text-foreground mb-2">
                    {Math.round(forecastData.forecast[0].mean_temperature.value)}°C
                  </div>
                  <p className="text-lg text-foreground mb-4">Clear</p>
                  <p className="text-muted-foreground">
                    Range: {Math.round(forecastData.forecast[0].min_temperature.value)}°C -{' '}
                    {Math.round(forecastData.forecast[0].max_temperature.value)}°C
                  </p>
                </div>
              </div>

              {/* Weather Details */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Dew Point</p>
                    <Droplets className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round(forecastData.forecast[0].mean_dewPoint.value)}°C
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Moisture indicator</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Wind Speed</p>
                    <Wind className="w-5 h-5 text-secondary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    {(forecastData.forecast[0].mean_windSpeed.value * 3.6).toFixed(1)} km/h
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Gentle winds</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Precipitation</p>
                    <CloudRain className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    {forecastData.forecast[0].total_precipitation.value.toFixed(1)} mm
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Expected today</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Visibility</p>
                    <Eye className="w-5 h-5 text-destructive" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    {forecastData.forecast[0].mean_visibility.value.toFixed(1)} km
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Excellent visibility</p>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">7-Day Forecast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {forecastData.forecast.map((day, idx) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <div key={day.date} className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition">
                      <p className="text-muted-foreground text-sm font-semibold mb-3">{dayName}</p>
                      <p className="text-3xl mb-3">
                        {day.total_precipitation.value > 0.5 ? '🌧️' : day.mean_windSpeed.value > 3 ? '💨' : '☀️'}
                      </p>
                      <div className="space-y-1">
                        <p className="text-foreground font-bold">{Math.round(day.mean_temperature.value)}°</p>
                        <p className="text-muted-foreground text-xs">{Math.round(day.min_temperature.value)}°</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extreme Weather Alerts & Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alerts from events */}
              <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                  <h3 className="text-xl font-bold text-foreground">Extreme Weather Alerts</h3>
                </div>
                <div className="space-y-3">
                  {forecastData.events[0]?.detailed_events && forecastData.events[0].detailed_events.length > 0 ? (
                    forecastData.events[0].detailed_events.map((event) => {
                      const severityColor =
                        event.severity === 'HIGH'
                          ? 'border-red-500 text-red-600 dark:text-red-400'
                          : event.severity === 'MODERATE'
                            ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                            : 'border-green-500 text-green-600 dark:text-green-400';
                      return (
                        <div key={event.event_id} className={`bg-background border-l-4 ${severityColor} rounded-lg p-4`}>
                          <p className="font-semibold">{event.type}</p>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">Confidence: {event.confidence}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground">No severe weather alerts for the next 7 days</p>
                  )}
                </div>
              </div>

              {/* Forecast Data Details */}
              <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold text-foreground">7-Day Detailed Forecast</h3>
                </div>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {forecastData.forecast.map((day) => {
                    const date = new Date(day.date);
                    const dayName = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    return (
                      <div key={day.date} className="p-3 bg-background border border-border rounded-lg">
                        <p className="font-semibold text-foreground text-sm mb-2">{dayName}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Temp</p>
                            <p className="text-foreground font-semibold">
                              {Math.round(day.mean_temperature.value)}°C
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Precip</p>
                            <p className="text-foreground font-semibold">{day.total_precipitation.value.toFixed(1)} mm</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Wind</p>
                            <p className="text-foreground font-semibold">
                              {(day.mean_windSpeed.value * 3.6).toFixed(1)} km/h
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Vis</p>
                            <p className="text-foreground font-semibold">{day.mean_visibility.value.toFixed(1)} km</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6 animate-pulse">
              <Cloud className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground text-lg font-semibold">Loading weather data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
