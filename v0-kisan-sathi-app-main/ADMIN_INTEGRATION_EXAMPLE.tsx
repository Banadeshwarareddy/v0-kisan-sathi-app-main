// Example: How to update admin/page.tsx to use real backend data
// Copy the relevant parts into your actual admin/page.tsx file

"use client"

import { useState, useEffect } from "react"
import { adminApi, type AdminStats, type User, type UserActivity } from "@/lib/admin-api"
// ... other imports remain the same

function AdminContent() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "activity" | "transactions" | "content">("overview")
  const [userFilter, setUserFilter] = useState<"all" | "farmer" | "buyer">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  
  // Replace mock data with real state
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [activity, setActivity] = useState<UserActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadInitialData()
  }, [])

  // Reload users when filters change
  useEffect(() => {
    if (activeTab === 'users' && !loading) {
      loadUsers()
    }
  }, [userFilter, statusFilter])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load all data in parallel
      const [statsResponse, usersResponse, activityResponse] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getActivity(),
      ])
      
      if (statsResponse.success) {
        setStats(statsResponse.data)
      }
      
      if (usersResponse.success) {
        setUsers(usersResponse.data)
      }
      
      if (activityResponse.success) {
        setActivity(activityResponse.data)
      }
    } catch (err: any) {
      console.error('Error loading admin data:', err)
      setError(err.message || 'Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const filters: any = {}
      if (userFilter !== 'all') filters.role = userFilter
      if (statusFilter !== 'all') filters.status = statusFilter
      
      const response = await adminApi.getUsers(filters)
      if (response.success) {
        setUsers(response.data)
      }
    } catch (err: any) {
      console.error('Error loading users:', err)
    }
  }

  const filteredUsers = users // Already filtered by backend

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted">
        <header className="border-b border-border bg-card sticky top-0 z-50">
          {/* Header content */}
        </header>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </main>
    )
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted">
        <header className="border-b border-border bg-card sticky top-0 z-50">
          {/* Header content */}
        </header>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={loadInitialData}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header - same as before */}
      
      {/* Navigation Tabs - same as before */}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab - Use real stats */}
        {activeTab === "overview" && stats && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Dashboard Overview</h2>

            {/* Stats Grid with real data */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Users</p>
                <p className="text-3xl font-bold text-foreground">{stats.total_users}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Active Users</p>
                <p className="text-3xl font-bold text-foreground">{stats.active_users}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Transactions</p>
                <p className="text-3xl font-bold text-foreground">{stats.total_transactions}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Revenue</p>
                <p className="text-3xl font-bold text-foreground">
                  ₹{(stats.revenue / 1000).toFixed(1)}K
                </p>
              </Card>
            </div>

            {/* Recent Activity with real data */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <p className="font-semibold text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.district}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Transactions card - keep mock data for now */}
            </div>
          </div>
        )}

        {/* Users Tab - Use real users data */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground">All Registered Users</h2>
              <div className="flex gap-2">
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value as typeof userFilter)}
                  className="px-4 py-2 border border-border rounded-md bg-card text-foreground"
                >
                  <option value="all">All Roles</option>
                  <option value="farmer">Farmers</option>
                  <option value="buyer">Buyers</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="px-4 py-2 border border-border rounded-md bg-card text-foreground"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Stats Cards with real data */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Farmers</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.role === "farmer").length}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Buyers</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.role === "buyer").length}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Active Today</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.status === "active").length}
                </p>
              </Card>
            </div>

            {/* Users Table with real data */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">District</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Joined</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                        <td className="px-6 py-4 text-foreground">{user.email}</td>
                        <td className="px-6 py-4 text-foreground">{user.phone}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              user.role === "farmer"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-foreground">{user.district}</td>
                        <td className="px-6 py-4 text-foreground">{user.joinDate}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* User Activity Tab - Use real activity data */}
        {activeTab === "activity" && activity && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">User Login Activity</h2>

            {/* Activity Stats with real data */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Logins Today</p>
                <p className="text-2xl font-bold text-foreground">{activity.stats.logins_today}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Active Users Now</p>
                <p className="text-2xl font-bold text-green-600">{activity.stats.active_now}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">New Signups Today</p>
                <p className="text-2xl font-bold text-blue-600">{activity.stats.signups_today}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Avg. Session Time</p>
                <p className="text-2xl font-bold text-foreground">{activity.stats.avg_session_time}m</p>
              </Card>
            </div>

            {/* Recent Login Activity with real data */}
            <Card className="overflow-hidden mb-6">
              <div className="p-6 border-b border-border">
                <h3 className="text-xl font-bold text-foreground">Recent Login Activity</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Last Login</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.recent_logins.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                        <td className="px-6 py-4 text-foreground">{user.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              user.role === "farmer"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-foreground">{user.lastLogin}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Recent Signups with real data */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Recent Signups (Last 7 Days)</h3>
              <div className="space-y-3">
                {activity.recent_signups.map((user) => (
                  <div key={user.id} className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{user.joinDate}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.role === "farmer"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Other tabs remain the same */}
      </div>
    </main>
  )
}
