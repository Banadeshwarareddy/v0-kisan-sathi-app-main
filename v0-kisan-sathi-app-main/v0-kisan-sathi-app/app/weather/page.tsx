"use client"

import { Card } from "@/components/ui/card"
import * as React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/components/auth-context"
import { useActivityTracker } from "@/hooks/use-activity-tracker"
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  Info, 
  X,
  MapPin,
  Calendar,
  Thermometer
} from "lucide-react"

type WeatherSummary = {
  current: { 
    temp: number
    condition: string
    humidity: number
    windSpeed: number
    rainfall: number
    icon?: string
    iconUrl?: string
    feelsLike?: number
  }
  forecast: { 
    day: string
    high: number
    low: number
    condition: string
    rainfall: number
    icon?: string
    iconUrl?: string
  }[]
  alerts: { 
    type: string
    message: string
    icon?: string
    id?: string
  }[]
  city?: string
}

function WeatherContent() {
  // Track page visit
  useActivityTracker(
    "Weather Updates",
    "Real-time weather forecasts and alerts",
    "🌤️",
    "/weather"
  );

  const { user } = useAuth()
  // Start with default data for instant loading
  const [data, setData] = React.useState<WeatherSummary | null>({
    current: {
      temp: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      rainfall: 0,
      feelsLike: 30
    },
    forecast: [
      { day: 'Today', high: 32, low: 24, condition: 'Sunny', rainfall: 0 },
      { day: 'Tomorrow', high: 31, low: 23, condition: 'Partly Cloudy', rainfall: 0 },
      { day: 'Wed', high: 30, low: 22, condition: 'Cloudy', rainfall: 2 },
      { day: 'Thu', high: 29, low: 21, condition: 'Light Rain', rainfall: 5 },
      { day: 'Fri', high: 28, low: 20, condition: 'Rain', rainfall: 10 }
    ],
    alerts: [],
    city: 'Loading...'
  })
  const [error, setError] = React.useState<string>("")
  const [query, setQuery] = React.useState<string>("")
  const [loading, setLoading] = React.useState<boolean>(false)
  const [dismissedAlerts, setDismissedAlerts] = React.useState<Set<string>>(new Set())
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000"

  const fetchWeather = React.useCallback(async (place: string) => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_BASE}/api/weather/summary/?q=${encodeURIComponent(place)}`, {
        headers: { Accept: "application/json" },
      })
      if (!res.ok) throw new Error("Failed to fetch weather")
      const json = await res.json()
      if (json.success) {
        const weatherData = {
          current: json.current,
          forecast: json.forecast,
          alerts: (json.alerts || []).map((alert: any, idx: number) => ({
            ...alert,
            id: `${Date.now()}-${idx}`
          })),
          city: json.city
        }
        setData(weatherData)
        
        // Auto-dismiss alerts after 2 seconds
        if (weatherData.alerts.length > 0) {
          setTimeout(() => {
            const alertIds = new Set(weatherData.alerts.map((a: any) => a.id as string))
            setDismissedAlerts(alertIds)
          }, 2000)
        }
      } else {
        setError(json.message || "Weather unavailable")
      }
    } catch (e) {
      setError("Weather unavailable")
    } finally {
      setLoading(false)
    }
  }, [API_BASE])

  React.useEffect(() => {
    const fallbackCity = user?.district && user.district.trim() ? user.district : "Bengaluru"
    setQuery(fallbackCity)
    // Delay API call to allow page to render first
    setTimeout(() => {
      fetchWeather(fallbackCity)
    }, 0)
  }, [user, fetchWeather])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setDismissedAlerts(new Set()) // Reset dismissed alerts on new search
    fetchWeather(query.trim())
  }

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase()
    if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain className="w-16 h-16 text-blue-500" />
    if (lower.includes('cloud')) return <Cloud className="w-16 h-16 text-gray-500" />
    if (lower.includes('sun') || lower.includes('clear')) return <Sun className="w-16 h-16 text-yellow-500" />
    return <Cloud className="w-16 h-16 text-gray-400" />
  }

  const visibleAlerts = data?.alerts.filter(alert => !dismissedAlerts.has(alert.id || '')) || []

  return (
    <>
      <DashboardHeader />
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Weather Forecast</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{data?.city || query}</span>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={onSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search location (e.g., Tumkur, Mysore, Bangalore)"
                className="w-full h-14 pl-12 pr-4 border-2 border-gray-200 rounded-xl bg-white text-gray-900 text-lg focus:border-green-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="h-14 px-8 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading || !query.trim()}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>

        {/* Weather Alerts - Auto-dismiss after 2 seconds */}
        {visibleAlerts.length > 0 && (
          <div className="mb-8 space-y-3 animate-in fade-in duration-300">
            {visibleAlerts.map((alert) => (
              <Card 
                key={alert.id}
                className={`p-5 border-l-4 ${
                  alert.type.toLowerCase().includes('warning') 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {alert.type.toLowerCase().includes('warning') ? (
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    ) : (
                      <Info className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">{alert.type}</p>
                    <p className="text-gray-700">{alert.message}</p>
                  </div>
                  <button
                    onClick={() => setDismissedAlerts(prev => new Set([...prev, alert.id || '']))}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <Card className="p-8 mb-8">
            <div className="flex items-center justify-center h-48">
              <div className="animate-pulse text-lg text-gray-500">Loading weather data...</div>
            </div>
          </Card>
        )}

        {/* Current Weather - Large Card */}
        {data && (
        <Card className="p-8 mb-8 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-100">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Temperature */}
            <div className="flex flex-col justify-center">
              <p className="text-gray-600 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Current Weather
              </p>
              <div className="flex items-center gap-6 mb-6">
                {data.current.iconUrl ? (
                  <img src={data.current.iconUrl} alt={data.current.condition} className="w-24 h-24" />
                ) : (
                  getWeatherIcon(data.current.condition)
                )}
                <div>
                  <div className="text-7xl font-bold text-gray-900">{data.current.temp}°</div>
                  <p className="text-xl text-gray-600 mt-2">Feels like {data.current.feelsLike || data.current.temp}°</p>
                </div>
              </div>
              <p className="text-3xl text-gray-800 capitalize font-medium">{data.current.condition}</p>
            </div>

            {/* Right: Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 p-5 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <p className="text-sm text-gray-600">Humidity</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{data.current.humidity}%</p>
              </div>
              <div className="bg-white/80 p-5 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-5 h-5 text-gray-500" />
                  <p className="text-sm text-gray-600">Wind Speed</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{data.current.windSpeed}</p>
                <p className="text-sm text-gray-600">km/h</p>
              </div>
              <div className="bg-white/80 p-5 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CloudRain className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-gray-600">Rainfall</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{data.current.rainfall}</p>
                <p className="text-sm text-gray-600">mm</p>
              </div>
              <div className="bg-white/80 p-5 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <p className="text-sm text-gray-600">UV Index</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">6</p>
                <p className="text-sm text-gray-600">Moderate</p>
              </div>
            </div>
          </div>
        </Card>
        )}

        {/* 5-Day Forecast */}
        {data && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            5-Day Forecast
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {data.forecast.map((day, idx) => (
              <Card 
                key={idx} 
                className="p-6 text-center hover:shadow-xl transition-all hover:scale-105 bg-white border-2 border-gray-100"
              >
                <p className="font-bold text-gray-900 mb-4 text-lg">{day.day}</p>
                <div className="mb-4 flex justify-center">
                  {day.iconUrl ? (
                    <img src={day.iconUrl} alt={day.condition} className="w-16 h-16" />
                  ) : (
                    <span className="text-5xl">{day.icon || '🌤️'}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4 capitalize">{day.condition}</p>
                <div className="flex justify-center gap-3 mb-3">
                  <span className="text-2xl font-bold text-gray-900">{day.high}°</span>
                  <span className="text-2xl text-gray-400">{day.low}°</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-blue-600">
                  <CloudRain className="w-4 h-4" />
                  <span className="text-sm font-medium">{day.rainfall}mm</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
        )}

        {/* Farming Tips Based on Weather */}
        {data && (
        <Card className="mt-8 p-6 bg-green-50 border-2 border-green-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🌾 Farming Tips</h3>
          <div className="space-y-2 text-gray-700">
            {data.current.rainfall > 10 && (
              <p>• Heavy rainfall detected. Ensure proper drainage in fields.</p>
            )}
            {data.current.humidity > 70 && (
              <p>• High humidity levels. Monitor crops for fungal diseases.</p>
            )}
            {data.current.temp > 35 && (
              <p>• High temperature. Ensure adequate irrigation for crops.</p>
            )}
            {data.current.windSpeed > 20 && (
              <p>• Strong winds. Secure lightweight structures and young plants.</p>
            )}
            {data.current.temp < 35 && data.current.humidity < 70 && data.current.rainfall === 0 && (
              <p>• Good weather conditions for farming activities.</p>
            )}
          </div>
        </Card>
        )}
      </main>
    </>
  )
}

export default function WeatherPage() {
  return (
    <ProtectedRoute>
      <WeatherContent />
    </ProtectedRoute>
  )
}
