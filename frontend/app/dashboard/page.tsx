'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cloud, MapPin, Search, X, Droplets, Wind, Gauge, Sun, AlertTriangle, TrendingUp } from 'lucide-react';

const POPULAR_CITIES = [
  { name: 'New York', country: 'USA' },
  { name: 'London', country: 'UK' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Paris', country: 'France' },
  { name: 'Dubai', country: 'UAE' },
  { name: 'Sydney', country: 'Australia' },
  { name: 'Toronto', country: 'Canada' },
  { name: 'Singapore', country: 'Singapore' },
  { name: 'Berlin', country: 'Germany' },
  { name: 'Bangkok', country: 'Thailand' },
];

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
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredCities = POPULAR_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName);
    setShowModal(false);
    setLoading(true);

    // Simulate fetching weather data
    setTimeout(() => {
      setWeatherData({
        city: cityName,
        temperature: Math.floor(Math.random() * 15 + 18),
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40 + 30),
        windSpeed: Math.floor(Math.random() * 25 + 5),
        pressure: Math.floor(Math.random() * 30 + 1000),
        visibility: Math.floor(Math.random() * 5 + 8),
        feelsLike: Math.floor(Math.random() * 15 + 16),
      });
      setLoading(false);
    }, 800);
  };

  const handleChangeCity = () => {
    setShowModal(true);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950 dark:from-black dark:via-slate-950 dark:to-slate-900">
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
      {selectedCity && weatherData && !loading && (
        <main className="px-6 sm:px-12 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* City Header */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground flex items-center gap-3">
                <MapPin className="w-8 h-8 text-primary" />
                {weatherData.city}
              </h1>
              <p className="text-muted-foreground mt-2">Real-time weather dashboard</p>
            </div>

            {/* Current Weather Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Weather Card */}
              <div className="lg:col-span-1 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Current Conditions</p>
                  <p className="text-5xl mb-2">
                    {weatherData.condition === 'Sunny'
                      ? '☀️'
                      : weatherData.condition === 'Cloudy'
                        ? '☁️'
                        : weatherData.condition === 'Rainy'
                          ? '🌧️'
                          : '⛅'}
                  </p>
                </div>
                <div>
                  <div className="text-6xl font-bold text-foreground mb-2">{weatherData.temperature}°C</div>
                  <p className="text-lg text-foreground mb-4">{weatherData.condition}</p>
                  <p className="text-muted-foreground">Feels like {weatherData.feelsLike}°C</p>
                </div>
              </div>

              {/* Weather Details */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Humidity</p>
                    <Droplets className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{weatherData.humidity}%</p>
                  <div className="mt-4 w-full bg-border rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: `${weatherData.humidity}%` }}></div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Wind Speed</p>
                    <Wind className="w-5 h-5 text-secondary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{weatherData.windSpeed} km/h</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {weatherData.windSpeed < 10 ? 'Light' : weatherData.windSpeed < 20 ? 'Moderate' : 'Strong'} winds
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Pressure</p>
                    <Gauge className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{weatherData.pressure} mb</p>
                  <p className="text-xs text-muted-foreground mt-2">Normal levels</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Visibility</p>
                    <Sun className="w-5 h-5 text-destructive" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{weatherData.visibility} km</p>
                  <p className="text-xs text-muted-foreground mt-2">Good visibility</p>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast Placeholder */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">7-Day Forecast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                  <div key={day} className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition">
                    <p className="text-muted-foreground text-sm font-semibold mb-3">{day}</p>
                    <p className="text-3xl mb-3">{idx % 3 === 0 ? '☀️' : idx % 3 === 1 ? '🌤️' : '⛅'}</p>
                    <div className="space-y-1">
                      <p className="text-foreground font-bold">{22 + idx}°</p>
                      <p className="text-muted-foreground text-xs">{15 + idx}°</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extreme Weather Alerts & Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alerts */}
              <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                  <h3 className="text-xl font-bold text-foreground">Extreme Weather Alerts</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-background border-l-4 border-yellow-500 rounded-lg p-4">
                    <p className="font-semibold text-yellow-600 dark:text-yellow-400">Heat Advisory</p>
                    <p className="text-sm text-muted-foreground mt-1">Probability: 45% - Monitor conditions</p>
                  </div>
                  <div className="bg-background border-l-4 border-blue-500 rounded-lg p-4">
                    <p className="font-semibold text-blue-600 dark:text-blue-400">Heavy Rainfall</p>
                    <p className="text-sm text-muted-foreground mt-1">Probability: 25% - Unlikely</p>
                  </div>
                  <div className="bg-background border-l-4 border-green-500 rounded-lg p-4">
                    <p className="font-semibold text-green-600 dark:text-green-400">Severe Winds</p>
                    <p className="text-sm text-muted-foreground mt-1">Probability: 10% - No threat</p>
                  </div>
                </div>
              </div>

              {/* Model Insights */}
              <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold text-foreground">Prediction Model Insights</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Model Confidence</p>
                      <p className="text-sm font-semibold text-foreground">78%</p>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Data Quality</p>
                      <p className="text-sm font-semibold text-foreground">92%</p>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Last Updated:</span> Just now
                    </p>
                  </div>
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
