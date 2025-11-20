import { useEffect } from 'react'

interface Activity {
  title: string
  description: string
  icon: string
  timestamp: number
  href: string
}

export function useActivityTracker(
  title: string,
  description: string,
  icon: string,
  href: string
) {
  useEffect(() => {
    // Track page visit
    const trackVisit = () => {
      try {
        const activity: Activity = {
          title: `Visited ${title}`,
          description,
          icon,
          timestamp: Date.now(),
          href,
        }

        // Get existing activities
        const stored = localStorage.getItem('recentActivities')
        const activities: Activity[] = stored ? JSON.parse(stored) : []

        // Remove duplicate if exists (same href)
        const filtered = activities.filter(a => a.href !== href)

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

    trackVisit()
  }, [title, description, icon, href])
}

export function trackModuleActivity(
  title: string,
  description: string,
  icon: string,
  href: string
) {
  try {
    const activity: Activity = {
      title: `Visited ${title}`,
      description,
      icon,
      timestamp: Date.now(),
      href,
    }

    // Get existing activities
    const stored = localStorage.getItem('recentActivities')
    const activities: Activity[] = stored ? JSON.parse(stored) : []

    // Remove duplicate if exists (same href)
    const filtered = activities.filter(a => a.href !== href)

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
