"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/components/auth-context"
import { useEffect, useState } from "react"

const features = [
  {
    title: "Farm Management",
    description: "Track expenses, income, inventory & profit for your farm",
    icon: "🌾",
    href: "/farm-management",
    color: "bg-emerald-50 dark:bg-emerald-950",
  },
  {
    title: "Weather Updates",
    description: "Real-time weather forecasts and alerts",
    icon: "🌤️",
    href: "/weather",
    color: "bg-blue-50 dark:bg-blue-950",
  },
  {
    title: "Mandi Prices",
    description: "Current market prices for crops",
    icon: "📈",
    href: "/mandi-prices",
    color: "bg-green-50 dark:bg-green-950",
  },
  {
    title: "Government Schemes",
    description: "Subsidies and support programs",
    icon: "📋",
    href: "/schemes",
    color: "bg-purple-50 dark:bg-purple-950",
  },
  {
    title: "AI Crop Detector",
    description: "Identify crop diseases with AI",
    icon: "🔬",
    href: "/crop-doctor",
    color: "bg-orange-50 dark:bg-orange-950",
  },
  {
    title: "Marketplace",
    description: "Buy and sell agricultural products",
    icon: "🛒",
    href: "/marketplace",
    color: "bg-red-50 dark:bg-red-950",
  },
  {
    title: "AI Assistant",
    description: "Get farming advice 24/7",
    icon: "💬",
    href: "/chatbot",
    color: "bg-indigo-50 dark:bg-indigo-950",
  },
  {
    title: "Soil Analysis",
    description: "AI-powered soil testing and recommendations",
    icon: "🧪",
    href: "/soil-analysis",
    color: "bg-amber-50 dark:bg-amber-950",
  },
]

interface Activity {
  title: string
  description: string
  icon: string
  timestamp: number
  href: string
}

function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Load recent activities from localStorage
    const loadActivities = () => {
      try {
        if (typeof window === 'undefined') return
        const stored = localStorage.getItem('recentActivities')
        if (stored) {
          const parsed = JSON.parse(stored)
          // Filter out invalid activities (missing required fields)
          const validActivities = parsed.filter((a: Activity) => 
            a && a.href && a.title && a.icon && a.timestamp
          )
          setActivities(validActivities.slice(0, 5)) // Show only last 5 activities
        }
      } catch (error) {
        console.error('Error loading activities:', error)
        // Clear corrupted data
        localStorage.removeItem('recentActivities')
      }
    }

    loadActivities()

    // Listen for storage changes (when user visits a module)
    const handleStorageChange = () => {
      loadActivities()
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event from same window
    window.addEventListener('activityAdded', loadActivities)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('activityAdded', loadActivities)
    }
  }, [mounted])

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return new Date(timestamp).toLocaleDateString()
  }

  if (activities.length === 0) {
    return (
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h3>
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-muted-foreground mb-2">No recent activity</p>
          <p className="text-sm text-muted-foreground">
            Start exploring features to see your activity here
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">Recent Activity</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            localStorage.removeItem('recentActivities')
            setActivities([])
          }}
        >
          Clear All
        </Button>
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            // Skip activities with invalid href
            if (!activity.href) return null
            
            return (
              <Link key={index} href={activity.href}>
                <div className={`flex items-start gap-4 pb-4 hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors cursor-pointer ${
                  index < activities.length - 1 ? 'border-b border-border' : ''
                }`}>
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function trackActivity(feature: typeof features[0]) {
  try {
    if (typeof window === 'undefined') return
    
    const activity: Activity = {
      title: `Visited ${feature.title}`,
      description: feature.description,
      icon: feature.icon,
      timestamp: Date.now(),
      href: feature.href,
    }

    // Get existing activities
    const stored = localStorage.getItem('recentActivities')
    const activities: Activity[] = stored ? JSON.parse(stored) : []

    // Remove duplicate if exists (same href)
    const filtered = activities.filter(a => a.href !== feature.href)

    // Add new activity at the beginning
    const updated = [activity, ...filtered].slice(0, 10) // Keep only last 10

    // Save to localStorage
    localStorage.setItem('recentActivities', JSON.stringify(updated))

    // Dispatch custom event to update UI
    window.dispatchEvent(new Event('activityAdded'))
  } catch (error) {
    console.error('Error tracking activity:', error)
  }
}

function DashboardContent() {
  const { user } = useAuth()

  return (
    <>
      <DashboardHeader />
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back{user?.name ? `, ${user.name}` : ''}!</h2>
          <p className="text-muted-foreground">
            {user?.district ? `You're farming in ${user.district}. ` : ''}
            Here's what you can do today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-4xl mb-2">🌾</div>
            <p className="text-sm text-muted-foreground mb-1">Active Crops</p>
            <p className="text-2xl font-bold text-foreground">3</p>
          </Card>
          <Card className="p-6">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm text-muted-foreground mb-1">Market Updates</p>
            <p className="text-2xl font-bold text-foreground">12</p>
          </Card>
          <Card className="p-6">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-sm text-muted-foreground mb-1">Alerts</p>
            <p className="text-2xl font-bold text-foreground">2</p>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Explore Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link 
                key={feature.href} 
                href={feature.href}
                onClick={() => trackActivity(feature)}
              >
                <Card className={`p-6 h-full hover:shadow-lg transition-shadow cursor-pointer ${feature.color}`}>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h4>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button variant="outline" size="sm">
                    Explore
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </main>
    </>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
