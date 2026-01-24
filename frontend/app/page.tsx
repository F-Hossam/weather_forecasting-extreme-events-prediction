'use client';

import Link from 'next/link';
import { Cloud, Zap, TrendingUp, Globe, AlertTriangle, Gauge } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:bg-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 sm:px-12 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Cloud className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground">WeatherPredict</span>
        </div>
        <Link
          href="/weather"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
        >
          Launch App
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 sm:px-12 py-20 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8 mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <p className="text-sm font-semibold text-primary">Next Generation Weather Intelligence</p>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-foreground leading-tight">
              Smart Weather <span className="text-primary">Predictions</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              Real-time weather analysis powered by advanced AI. Get accurate forecasts and severe weather alerts before they happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/weather"
                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-bold text-lg hover:bg-secondary/90 transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Zap className="w-5 h-5" />
                Start Forecasting
              </Link>
              <Link
                href="/alerts"
                className="px-8 py-4 bg-card border border-border text-foreground rounded-lg font-bold text-lg hover:bg-card/80 transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <AlertTriangle className="w-5 h-5" />
                View Alerts
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-16">
            <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition">
              <div className="inline-block p-3 bg-primary/15 rounded-lg mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Coverage</p>
              <h3 className="text-3xl font-bold text-foreground">500+</h3>
              <p className="text-muted-foreground text-sm">Cities Worldwide</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 hover:border-accent/50 transition">
              <div className="inline-block p-3 bg-accent/15 rounded-lg mb-4">
                <Gauge className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Updates</p>
              <h3 className="text-3xl font-bold text-foreground">Real-time</h3>
              <p className="text-muted-foreground text-sm">Live Data Feed</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 hover:border-secondary/50 transition">
              <div className="inline-block p-3 bg-secondary/15 rounded-lg mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
              <h3 className="text-3xl font-bold text-foreground">98%</h3>
              <p className="text-muted-foreground text-sm">AI Prediction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 sm:px-12 py-20 bg-card/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">Everything you need to stay prepared</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background border border-border rounded-xl p-8 hover:border-primary/50 transition">
              <div className="p-3 bg-primary/15 rounded-lg w-fit mb-6">
                <Cloud className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Real-Time Weather</h3>
              <p className="text-muted-foreground">
                Live temperature, humidity, wind speed, pressure, and visibility updates every minute for your selected cities.
              </p>
            </div>
            <div className="bg-background border border-border rounded-xl p-8 hover:border-accent/50 transition">
              <div className="p-3 bg-accent/15 rounded-lg w-fit mb-6">
                <AlertTriangle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Severe Weather Alerts</h3>
              <p className="text-muted-foreground">
                Instant notifications for extreme conditions including heat waves, storms, flooding risks, and hazardous winds.
              </p>
            </div>
            <div className="bg-background border border-border rounded-xl p-8 hover:border-secondary/50 transition">
              <div className="p-3 bg-secondary/15 rounded-lg w-fit mb-6">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">7-Day Forecast</h3>
              <p className="text-muted-foreground">
                Detailed predictions for the next week with temperature trends, precipitation chances, and wind patterns.
              </p>
            </div>
            <div className="bg-background border border-border rounded-xl p-8 hover:border-primary/50 transition">
              <div className="p-3 bg-primary/15 rounded-lg w-fit mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">AI Predictions</h3>
              <p className="text-muted-foreground">
                Machine learning models trained on historical data to predict extreme weather events before they occur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 sm:px-12 py-20 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Select Your City</h3>
              <p className="text-muted-foreground">
                Choose from 500+ cities or search for your location to get started.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/20 rounded-full mb-6">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Get Real-Time Data</h3>
              <p className="text-muted-foreground">
                View current weather conditions and detailed atmospheric information instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary/20 rounded-full mb-6">
                <span className="text-2xl font-bold text-secondary">3</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Check Forecasts</h3>
              <p className="text-muted-foreground">
                Access AI-powered predictions and receive alerts for severe weather events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 sm:px-12 py-20 sm:py-32 bg-primary/5 border-y border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Ready to Master Your Weather?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users staying ahead of weather with WeatherPredict's advanced AI-powered forecasting.
          </p>
          <Link
            href="/weather"
            className="inline-block px-10 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-all"
          >
            Start Now, It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 sm:px-12 py-8 text-center text-muted-foreground">
        <p>WeatherPredict © 2024. Advanced AI-powered weather intelligence for a changing climate.</p>
      </footer>
    </div>
  );
}
