# Morocco Extreme Weather Event Detection System
# Knowledge Engineering Implementation for 7-Day Forecasts

class MoroccoWeatherKnowledgeSystem:
    """
    Knowledge-based system for extreme weather detection in Morocco
    Based on meteorological research and Moroccan climate thresholds
    """
    
    def __init__(self):
        # Knowledge Base: Rules derived from Moroccan meteorological standards
        self.knowledge_base = self._initialize_knowledge_base()
    
    def _initialize_knowledge_base(self):
        """Initialize the knowledge base with expert rules"""
        return {
            # HEAT-RELATED RULES
            "extreme_heat": {
                "name": "Extreme Heat",
                "description": "Dangerously high temperature - red alert level",
                "condition": lambda d: d["t_max"] >= 45.0,
                "severity": "EXTREME",
                "confidence": "HIGH",
                "source": "Morocco recorded 50.4°C in 2023; DGM red alert threshold"
            },
            
            "high_heat": {
                "name": "High Heat",
                "description": "Hot conditions requiring precautions",
                "condition": lambda d: 38.0 <= d["t_max"] < 40.0,
                "severity": "MODERATE",
                "confidence": "HIGH",
                "source": "Sustained heat affecting health and agriculture"
            },
            
            "tropical_night": {
                "name": "Tropical Night",
                "description": "Oppressive nighttime heat - health risk",
                "condition": lambda d: d["t_min"] >= 26.0,
                "severity": "MODERATE",
                "confidence": "HIGH",
                "source": "Morocco heat risk framework: 26°C+ minimum"
            },
            
            # COLD-RELATED RULES
            "extreme_cold": {
                "name": "Extreme Cold",
                "description": "Dangerously low temperatures",
                "condition": lambda d: d["t_min"] <= -10.0,
                "severity": "EXTREME",
                "confidence": "HIGH",
                "source": "2017 cold wave: -13°C recorded in Morocco"
            },
            
            "severe_freeze": {
                "name": "Severe Freeze",
                "description": "Severe freezing conditions",
                "condition": lambda d: -10.0 < d["t_min"] <= -5.0,
                "severity": "HIGH",
                "confidence": "HIGH",
                "source": "2018 cold wave: -5°C; severe agricultural impact"
            },
            
            "freeze": {
                "name": "Freeze",
                "description": "Freezing temperatures - agricultural risk",
                "condition": lambda d: 0.0 < d["t_min"] <= -5.0,
                "severity": "MODERATE",
                "confidence": "HIGH",
                "source": "Frost impacts crops in Atlas regions"
            },
            
            "near_freeze": {
                "name": "Near Freeze",
                "description": "Near-freezing conditions",
                "condition": lambda d: 0.0 <= d["t_min"] <= 2.0,
                "severity": "LOW",
                "confidence": "MODERATE",
                "source": "Frost risk for sensitive vegetation"
            },
            
            # PRECIPITATION-RELATED RULES (CORRECTED UNITS: mm not m/s!)
            "extreme_rainfall": {
                "name": "Extreme Rainfall",
                "description": "Extreme precipitation - red alert, major flood risk",
                "condition": lambda d: d["rain"] >= 80.0,
                "severity": "EXTREME",
                "confidence": "HIGH",
                "source": "DGM red alert: 80-120mm; recent floods from such amounts"
            },
            
            "heavy_rain": {
                "name": "Heavy Rain",
                "description": "Heavy precipitation - orange alert",
                "condition": lambda d: 30.0 <= d["rain"] < 50.0,
                "severity": "MODERATE",
                "confidence": "HIGH",
                "source": "DGM orange alert threshold: 30mm+"
            },
            
            "flash_flood_risk": {
                "name": "Flash Flood Risk",
                "description": "Critical flash flood conditions",
                "condition": lambda d: d["rain"] >= 37.0,
                "severity": "HIGH",
                "confidence": "HIGH",
                "source": "37mm caused deadly Safi floods (Dec 2025)"
            },
            
            # WIND-RELATED RULES (CORRECTED UNITS: km/h not m/s!)
            "violent_wind": {
                "name": "Violent Wind",
                "description": "Extremely dangerous wind conditions",
                "condition": lambda d: d["wind"] >= 100.0,
                "severity": "EXTREME",
                "confidence": "HIGH",
                "source": "100+ km/h: DGM red alert; Storm Francis 2026"
            },
            
            "strong_wind": {
                "name": "Strong Wind",
                "description": "Strong winds requiring precautions",
                "condition": lambda d: 75.0 <= d["wind"] < 90.0,
                "severity": "MODERATE",
                "confidence": "HIGH",
                "source": "DGM orange alert: 75-90 km/h"
            },
            
            "moderate_wind": {
                "name": "Moderate Wind",
                "description": "Elevated wind speeds",
                "condition": lambda d: 50.0 <= d["wind"] < 75.0,
                "severity": "LOW",
                "confidence": "MODERATE",
                "source": "Moderate winds affecting outdoor activities"
            },
            
            # COMPOUND EVENT RULES
            "fire_weather": {
                "name": "Fire Weather",
                "description": "Extreme fire danger - hot, dry, windy",
                "condition": lambda d: (
                    d["t_max"] >= 38.0 and 
                    d["dew"] <= 10.0 and 
                    d["wind"] >= 40.0 and
                    d["rain"] < 1.0
                ),
                "severity": "HIGH",
                "confidence": "HIGH",
                "source": "Heat + low humidity + wind causes forest fires"
            },
            
            "extreme_storm": {
                "name": "Extreme Storm",
                "description": "Extreme storm - heavy rain + violent winds",
                "condition": lambda d: (
                    d["rain"] >= 80.0 and 
                    d["wind"] >= 90.0
                ),
                "severity": "EXTREME",
                "confidence": "HIGH",
                "source": "Red alert: extreme rain + violent wind combination"
            },
            
            "severe_storm": {
                "name": "Severe Storm",
                "description": "Severe storm conditions",
                "condition": lambda d: (
                    d["rain"] >= 30.0 and 
                    d["wind"] >= 75.0
                ),
                "severity": "HIGH",
                "confidence": "HIGH",
                "source": "Heavy rain + strong winds in Atlantic storms"
            },
            
            "humid_heat": {
                "name": "Humid Heat",
                "description": "Oppressive heat with high humidity",
                "condition": lambda d: (
                    d["t_max"] >= 35.0 and 
                    d["dew"] >= 20.0
                ),
                "severity": "HIGH",
                "confidence": "MODERATE",
                "source": "High temp + humidity increases heat stress"
            },
            
            # VISIBILITY RULES
            "extremely_poor_visibility": {
                "name": "Extremely Poor Visibility",
                "description": "Severe visibility restriction - safety hazard",
                "condition": lambda d: d["vis"] < 0.2,
                "severity": "HIGH",
                "confidence": "HIGH",
                "source": "Visibility < 200m: severe safety impact"
            },
            
            "fog_conditions": {
                "name": "Fog Conditions",
                "description": "Fog likely - reduced visibility",
                "condition": lambda d: (
                    d["vis"] <= 1.0 and 
                    (d["t_mean"] - d["dew"]) <= 2.5
                ),
                "severity": "LOW",
                "confidence": "MODERATE",
                "source": "Low visibility + small dew point spread = fog"
            }
        }
    
    def detect_extreme_events(self, forecast):
        """
        Main function to detect extreme weather events from forecast data
        
        Parameters:
        -----------
        forecast : list of dict
            Each day contains:
            - date: date string
            - mean_temperature: dict with 'value' key (°C)
            - max_temperature: dict with 'value' key (°C)
            - min_temperature: dict with 'value' key (°C)
            - total_precipitation: dict with 'value' key (mm)
            - mean_windSpeed: dict with 'value' key (km/h)
            - mean_dewPoint: dict with 'value' key (°C)
            - mean_visibility: dict with 'value' key (km)
        
        Returns:
        --------
        list: Detected extreme weather events
        """
        all_events = []
        
        # Process each day
        for day_data in forecast:
            # Extract values
            day = {
                "date": day_data["date"],
                "t_mean": day_data["mean_temperature"]["value"],
                "t_max": day_data["max_temperature"]["value"],
                "t_min": day_data["min_temperature"]["value"],
                "rain": day_data["total_precipitation"]["value"],
                "wind": day_data["mean_windSpeed"]["value"],
                "dew": day_data["mean_dewPoint"]["value"],
                "vis": day_data["mean_visibility"]["value"]
            }
            
            # Apply each rule from knowledge base
            for rule_id, rule in self.knowledge_base.items():
                try:
                    if rule["condition"](day):
                        event = {
                            "date": day["date"],
                            "event_id": rule_id,
                            "type": rule["name"],
                            "description": rule["description"],
                            "severity": rule["severity"],
                            "confidence": rule["confidence"],
                            "source": rule["source"],
                            "criteria": {
                                "t_max": day["t_max"],
                                "t_min": day["t_min"],
                                "t_mean": day["t_mean"],
                                "precipitation_mm": day["rain"],
                                "wind_kmh": day["wind"],
                                "dew_point": day["dew"],
                                "visibility_km": day["vis"]
                            }
                        }
                        all_events.append(event)
                except Exception as e:
                    # Skip rule if error occurs
                    continue
        
        # Detect multi-day patterns
        multi_day_events = self._detect_multi_day_patterns(forecast)
        all_events.extend(multi_day_events)
        
        # Remove duplicate compound events (keep highest severity)
        all_events = self._deduplicate_events(all_events)
        
        return all_events
    
    def _detect_multi_day_patterns(self, forecast):
        """Detect patterns that span multiple days"""
        patterns = []
        
        # Extract simplified day data
        days = []
        for day_data in forecast:
            days.append({
                "date": day_data["date"],
                "t_mean": day_data["mean_temperature"]["value"],
                "t_max": day_data["max_temperature"]["value"],
                "t_min": day_data["min_temperature"]["value"],
                "rain": day_data["total_precipitation"]["value"],
                "wind": day_data["mean_windSpeed"]["value"]
            })
        
        # HEAT WAVE: 3+ consecutive days >= 40°C
        heat_wave_days = self._find_consecutive_pattern(
            days, lambda d: d["t_max"] >= 40.0, min_days=3
        )
        if heat_wave_days:
            patterns.append({
                "date": f"{heat_wave_days[0]['date']} to {heat_wave_days[-1]['date']}",
                "event_id": "heat_wave",
                "type": "Heat Wave",
                "description": f"Heat wave: {len(heat_wave_days)} consecutive days >= 40°C",
                "severity": "HIGH",
                "confidence": "HIGH",
                "source": "DGM warnings for 40°C+ lasting 3+ days",
                "criteria": {
                    "duration_days": len(heat_wave_days),
                    "max_temp_range": f"{min(d['t_max'] for d in heat_wave_days)}-{max(d['t_max'] for d in heat_wave_days)}°C"
                }
            })
        
        # SEVERE HEAT WAVE: 5+ consecutive days >= 42°C
        severe_heat_wave_days = self._find_consecutive_pattern(
            days, lambda d: d["t_max"] >= 42.0, min_days=5
        )
        if severe_heat_wave_days:
            patterns.append({
                "date": f"{severe_heat_wave_days[0]['date']} to {severe_heat_wave_days[-1]['date']}",
                "event_id": "severe_heat_wave",
                "type": "Severe Heat Wave",
                "description": f"Severe heat wave: {len(severe_heat_wave_days)} consecutive days >= 42°C",
                "severity": "EXTREME",
                "confidence": "HIGH",
                "source": "Heat waves 5+ days with 42°C+ considered severe",
                "criteria": {
                    "duration_days": len(severe_heat_wave_days),
                    "max_temp_range": f"{min(d['t_max'] for d in severe_heat_wave_days)}-{max(d['t_max'] for d in severe_heat_wave_days)}°C"
                }
            })
        
        # COLD WAVE: 3+ consecutive days with min <= 5°C
        cold_wave_days = self._find_consecutive_pattern(
            days, lambda d: d["t_min"] <= 5.0, min_days=3
        )
        if cold_wave_days:
            patterns.append({
                "date": f"{cold_wave_days[0]['date']} to {cold_wave_days[-1]['date']}",
                "event_id": "cold_wave",
                "type": "Cold Wave",
                "description": f"Cold wave: {len(cold_wave_days)} consecutive days with min temp <= 5°C",
                "severity": "MODERATE",
                "confidence": "HIGH",
                "source": "Cold waves in Morocco: 3+ days around 5°C or lower",
                "criteria": {
                    "duration_days": len(cold_wave_days),
                    "min_temp_range": f"{min(d['t_min'] for d in cold_wave_days)}-{max(d['t_min'] for d in cold_wave_days)}°C"
                }
            })
        
        # DRY SPELL: 7+ consecutive days without significant rain
        dry_spell_days = self._find_consecutive_pattern(
            days, lambda d: d["rain"] < 1.0, min_days=7
        )
        if dry_spell_days:
            patterns.append({
                "date": f"{dry_spell_days[0]['date']} to {dry_spell_days[-1]['date']}",
                "event_id": "dry_spell",
                "type": "Dry Spell",
                "description": f"Dry spell: {len(dry_spell_days)} consecutive days without rain",
                "severity": "MODERATE",
                "confidence": "HIGH",
                "source": "7+ dry days impacts agriculture",
                "criteria": {
                    "duration_days": len(dry_spell_days),
                    "total_precipitation_mm": sum(d["rain"] for d in dry_spell_days)
                }
            })
        
        # PROLONGED HEAVY RAIN: 100mm+ over 3 days
        if len(days) >= 3:
            for i in range(len(days) - 2):
                three_day_rain = sum(days[j]["rain"] for j in range(i, i + 3))
                if three_day_rain >= 100.0:
                    patterns.append({
                        "date": f"{days[i]['date']} to {days[i+2]['date']}",
                        "event_id": "prolonged_heavy_rain",
                        "type": "Prolonged Heavy Rain",
                        "description": f"Prolonged heavy rainfall: {three_day_rain:.1f}mm over 3 days",
                        "severity": "HIGH",
                        "confidence": "HIGH",
                        "source": "100mm+ over 3 days causes widespread flooding",
                        "criteria": {
                            "total_precipitation_mm": three_day_rain,
                            "duration_days": 3
                        }
                    })
                    break  # Only report first occurrence
        
        # SUDDEN TEMPERATURE DROP: 15°C+ drop in 24 hours
        for i in range(len(days) - 1):
            temp_drop = days[i]["t_mean"] - days[i + 1]["t_mean"]
            if temp_drop >= 15.0:
                patterns.append({
                    "date": f"{days[i]['date']} to {days[i+1]['date']}",
                    "event_id": "cold_snap",
                    "type": "Cold Snap",
                    "description": f"Sudden temperature drop: {temp_drop:.1f}°C in 24 hours",
                    "severity": "MODERATE",
                    "confidence": "HIGH",
                    "source": "15°C+ drops indicate cold fronts",
                    "criteria": {
                        "temperature_drop": temp_drop,
                        "from_temp": days[i]["t_mean"],
                        "to_temp": days[i + 1]["t_mean"]
                    }
                })
        
        return patterns
    
    def _find_consecutive_pattern(self, days, condition_func, min_days):
        """Find consecutive days matching a condition"""
        consecutive = []
        longest_streak = []
        
        for day in days:
            if condition_func(day):
                consecutive.append(day)
            else:
                if len(consecutive) >= min_days and len(consecutive) > len(longest_streak):
                    longest_streak = consecutive.copy()
                consecutive = []
        
        # Check last streak
        if len(consecutive) >= min_days and len(consecutive) > len(longest_streak):
            longest_streak = consecutive
        
        return longest_streak if len(longest_streak) >= min_days else []
    
    def _deduplicate_events(self, events):
        """Remove duplicate events for same day, keeping highest severity"""
        severity_order = {"EXTREME": 4, "HIGH": 3, "MODERATE": 2, "LOW": 1}
        
        # Group by date
        by_date = {}
        for event in events:
            date = event["date"]
            if date not in by_date:
                by_date[date] = []
            by_date[date].append(event)
        
        # For compound events on same day, keep only highest severity
        deduplicated = []
        for date, day_events in by_date.items():
            # Separate compound from single events
            compound_events = [e for e in day_events if e["event_id"] in 
                             ["extreme_storm", "severe_storm", "fire_weather", "humid_heat"]]
            other_events = [e for e in day_events if e not in compound_events]
            
            # Keep highest severity compound event
            if compound_events:
                compound_events.sort(key=lambda e: severity_order.get(e["severity"], 0), reverse=True)
                deduplicated.append(compound_events[0])
            
            # Keep all other events
            deduplicated.extend(other_events)
        
        return deduplicated
    
    def generate_summary(self, events):
        """Generate comprehensive summary statistics of detected events"""
        if not events:
            return {
                "total_events": 0,
                "severity_distribution": {},
                "event_types": {},
                "event_categories": {},
                "max_severity": None,
                "high_risk_days": [],
                "event_timeline": [],
                "detailed_events": []
            }
        
        severity_counts = {}
        event_type_counts = {}
        event_category_counts = {}
        high_risk_days = []
        event_timeline = []
        detailed_events = []
        
        # Define event categories
        category_map = {
            "extreme_heat": "Heat",
            "very_high_heat": "Heat",
            "high_heat": "Heat",
            "tropical_night": "Heat",
            "heat_wave": "Heat",
            "severe_heat_wave": "Heat",
            "extreme_cold": "Cold",
            "severe_freeze": "Cold",
            "freeze": "Cold",
            "near_freeze": "Cold",
            "cold_wave": "Cold",
            "cold_snap": "Cold",
            "extreme_rainfall": "Precipitation",
            "very_heavy_rain": "Precipitation",
            "heavy_rain": "Precipitation",
            "flash_flood_risk": "Precipitation",
            "prolonged_heavy_rain": "Precipitation",
            "dry_spell": "Drought",
            "violent_wind": "Wind",
            "very_strong_wind": "Wind",
            "strong_wind": "Wind",
            "moderate_wind": "Wind",
            "fire_weather": "Compound",
            "extreme_storm": "Compound",
            "severe_storm": "Compound",
            "humid_heat": "Compound",
            "extremely_poor_visibility": "Visibility",
            "very_poor_visibility": "Visibility",
            "fog_conditions": "Visibility"
        }
        
        for event in events:
            # Count by severity
            sev = event["severity"]
            severity_counts[sev] = severity_counts.get(sev, 0) + 1
            
            # Count by type
            etype = event["type"]
            event_type_counts[etype] = event_type_counts.get(etype, 0) + 1
            
            # Count by category
            event_id = event["event_id"]
            category = category_map.get(event_id, "Other")
            event_category_counts[category] = event_category_counts.get(category, 0) + 1
            
            # Track extreme/high severity days
            if sev in ["EXTREME", "HIGH"]:
                high_risk_days.append({
                    "date": event["date"],
                    "type": event["type"],
                    "severity": sev,
                    "description": event["description"],
                    "category": category
                })
            
            # Build timeline
            event_timeline.append({
                "date": event["date"],
                "event_id": event["event_id"],
                "type": event["type"],
                "severity": sev,
                "category": category
            })
            
            # Detailed event information
            detailed_event = {
                "date": event["date"],
                "event_id": event["event_id"],
                "type": event["type"],
                "description": event["description"],
                "severity": event["severity"],
                "confidence": event["confidence"],
                "category": category,
                "source": event["source"]
            }
            
            # Add criteria if available
            if "criteria" in event:
                detailed_event["criteria"] = event["criteria"]
            
            detailed_events.append(detailed_event)
        
        # Sort timeline by date
        event_timeline.sort(key=lambda x: x["date"])
        
        # Calculate statistics
        severity_order = {"EXTREME": 4, "HIGH": 3, "MODERATE": 2, "LOW": 1}
        max_severity = max(severity_counts.keys(), 
                          key=lambda s: severity_order.get(s, 0))
        
        # Find most affected days (days with multiple events)
        days_with_counts = {}
        for event in events:
            date = event["date"]
            if " to " not in date:  # Only count single-day events
                days_with_counts[date] = days_with_counts.get(date, 0) + 1
        
        most_affected_days = sorted(
            [{"date": date, "event_count": count} 
             for date, count in days_with_counts.items()],
            key=lambda x: x["event_count"],
            reverse=True
        )[:5]  # Top 5 most affected days
        
        # Calculate severity score (weighted)
        severity_score = (
            severity_counts.get("EXTREME", 0) * 4 +
            severity_counts.get("HIGH", 0) * 3 +
            severity_counts.get("MODERATE", 0) * 2 +
            severity_counts.get("LOW", 0) * 1
        )
        
        return {
            "total_events": len(events),
            "severity_distribution": severity_counts,
            "severity_score": severity_score,
            "event_types": event_type_counts,
            "event_categories": event_category_counts,
            "max_severity": max_severity,
            "high_risk_days": high_risk_days,
            "most_affected_days": most_affected_days,
            "event_timeline": event_timeline,
            "detailed_events": detailed_events,
            "statistics": {
                "extreme_events": severity_counts.get("EXTREME", 0),
                "high_severity_events": severity_counts.get("HIGH", 0),
                "moderate_severity_events": severity_counts.get("MODERATE", 0),
                "low_severity_events": severity_counts.get("LOW", 0),
                "heat_related": event_category_counts.get("Heat", 0),
                "cold_related": event_category_counts.get("Cold", 0),
                "precipitation_related": event_category_counts.get("Precipitation", 0),
                "wind_related": event_category_counts.get("Wind", 0),
                "compound_events": event_category_counts.get("Compound", 0),
                "drought_related": event_category_counts.get("Drought", 0),
                "visibility_related": event_category_counts.get("Visibility", 0)
            }
        }
    
    def generate_recommendations(self, events):
        """Generate safety recommendations based on detected events"""
        if not events:
            return ["No extreme weather events detected. Normal precautions apply."]
        
        recommendations = set()
        event_types = [e["event_id"] for e in events]
        severities = [e["severity"] for e in events]
        
        # Urgent warnings for extreme events
        if "EXTREME" in severities:
            recommendations.add("⚠️ URGENT: Extreme weather conditions detected. Follow all official warnings and stay informed.")
        
        # Heat-related recommendations
        if any("heat" in et or "tropical_night" in et for et in event_types):
            recommendations.add("🌡️ HEAT: Stay hydrated, avoid outdoor activities 12pm-5pm, check on elderly/vulnerable, never leave children/pets in vehicles.")
        
        # Cold-related recommendations
        if any("cold" in et or "freeze" in et for et in event_types):
            recommendations.add("❄️ COLD: Protect water pipes, ensure adequate heating, dress in layers, check on elderly neighbors, protect livestock.")
        
        # Precipitation recommendations
        if any("rain" in et or "flood" in et or "storm" in et for et in event_types):
            recommendations.add("🌧️ FLOODING: Avoid wadis and low-lying areas, never drive through flooded roads, secure property, monitor weather updates.")
        
        # Wind recommendations
        if any("wind" in et or "storm" in et for et in event_types):
            recommendations.add("💨 WIND: Secure loose objects, avoid trees and power lines, stay indoors during severe winds, delay travel if possible.")
        
        # Fire weather
        if any("fire" in et for et in event_types):
            recommendations.add("🔥 FIRE DANGER: Extreme fire risk. No outdoor burning, report smoke immediately, prepare evacuation routes.")
        
        # Visibility
        if any("visibility" in et or "fog" in et for et in event_types):
            recommendations.add("🌫️ VISIBILITY: Reduce driving speed, use fog lights, increase following distance, avoid unnecessary travel.")
        
        # Drought
        if any("dry" in et for et in event_types):
            recommendations.add("💧 DROUGHT: Conserve water, monitor crop irrigation, follow local water restrictions.")
        
        return sorted(list(recommendations))


def integrate_events_into_forecast(forecast_data):
    weather_system = MoroccoWeatherKnowledgeSystem()
    
    # Detect all events
    detected_events = weather_system.detect_extreme_events(forecast_data)
    
    # Group events by date
    events_by_date = {}
    for event in detected_events:
        date = event["date"]
        if date not in events_by_date:
            events_by_date[date] = []
        events_by_date[date].append(event)
    
    # Add events to each day in the forecast
    for day in forecast_data:
        day_date = day["date"]
        day["events"] = events_by_date.get(day_date, [])
    
    # Also add summary at top level
    event_summary = weather_system.generate_summary(detected_events)
    recommendations = weather_system.generate_recommendations(detected_events)
    
    return event_summary, recommendations
