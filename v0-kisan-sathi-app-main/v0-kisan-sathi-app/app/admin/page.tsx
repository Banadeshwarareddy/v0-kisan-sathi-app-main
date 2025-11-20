"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { adminApi, type AdminStats as ApiAdminStats, type User as ApiUser, type UserActivity } from "@/lib/admin-api"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalTransactions: number
  revenue: number
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  district: string
  role: "farmer" | "buyer" | "admin"
  joinDate: string
  lastLogin: string
  status: "active" | "inactive"
  loginCount: number
}

interface Transaction {
  id: string
  user: string
  type: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
}

const mockStats: AdminStats = {
  totalUsers: 1250,
  activeUsers: 890,
  totalTransactions: 3420,
  revenue: 245000,
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Ramesh Kumar",
    email: "ramesh@example.com",
    phone: "+91 9876543210",
    district: "Bengaluru",
    role: "farmer",
    joinDate: "2025-01-15",
    lastLogin: "2025-01-28 10:30 AM",
    status: "active",
    loginCount: 45,
  },
  {
    id: "2",
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "+91 9876543211",
    district: "Mysuru",
    role: "buyer",
    joinDate: "2025-01-20",
    lastLogin: "2025-01-28 09:15 AM",
    status: "active",
    loginCount: 32,
  },
  {
    id: "3",
    name: "Suresh Patel",
    email: "suresh@example.com",
    phone: "+91 9876543212",
    district: "Hassan",
    role: "farmer",
    joinDate: "2025-01-10",
    lastLogin: "2025-01-25 03:45 PM",
    status: "inactive",
    loginCount: 12,
  },
  {
    id: "4",
    name: "Anita Sharma",
    email: "anita@example.com",
    phone: "+91 9876543213",
    district: "Belagavi",
    role: "buyer",
    joinDate: "2025-01-25",
    lastLogin: "2025-01-28 11:20 AM",
    status: "active",
    loginCount: 28,
  },
  {
    id: "5",
    name: "Vijay Reddy",
    email: "vijay@example.com",
    phone: "+91 9876543214",
    district: "Hyderabad",
    role: "farmer",
    joinDate: "2025-01-18",
    lastLogin: "2025-01-28 08:00 AM",
    status: "active",
    loginCount: 38,
  },
  {
    id: "6",
    name: "Lakshmi Devi",
    email: "lakshmi@example.com",
    phone: "+91 9876543215",
    district: "Warangal",
    role: "farmer",
    joinDate: "2025-01-22",
    lastLogin: "2025-01-27 05:30 PM",
    status: "active",
    loginCount: 25,
  },
  {
    id: "7",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    phone: "+91 9876543216",
    district: "Pune",
    role: "buyer",
    joinDate: "2025-01-12",
    lastLogin: "2025-01-28 07:45 AM",
    status: "active",
    loginCount: 52,
  },
  {
    id: "8",
    name: "Kavita Nair",
    email: "kavita@example.com",
    phone: "+91 9876543217",
    district: "Kochi",
    role: "farmer",
    joinDate: "2025-01-08",
    lastLogin: "2025-01-26 02:15 PM",
    status: "inactive",
    loginCount: 8,
  },
]

const mockTransactions: Transaction[] = [
  {
    id: "1",
    user: "Ramesh Kumar",
    type: "Marketplace Sale",
    amount: 5000,
    date: "2025-01-28",
    status: "completed",
  },
  {
    id: "2",
    user: "Priya Singh",
    type: "Marketplace Purchase",
    amount: 3500,
    date: "2025-01-27",
    status: "completed",
  },
  {
    id: "3",
    user: "Suresh Patel",
    type: "Scheme Application",
    amount: 15000,
    date: "2025-01-26",
    status: "pending",
  },
  {
    id: "4",
    user: "Anita Sharma",
    type: "Marketplace Sale",
    amount: 8000,
    date: "2025-01-25",
    status: "completed",
  },
]

function AdminContent() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "activity" | "transactions" | "content">("overview")
  const [userFilter, setUserFilter] = useState<"all" | "farmer" | "buyer">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  
  // Real data state
  const [stats, setStats] = useState<ApiAdminStats | null>(null)
  const [users, setUsers] = useState<ApiUser[]>([])
  const [activity, setActivity] = useState<UserActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Load data on mount
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
      setError(err.message || 'Failed to load data. Using mock data for now.')
      // Fallback to mock data
      setStats(mockStats as any)
      setUsers(mockUsers as any)
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
  
  const filteredUsers = users

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🌾</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">Kisan Sathi Admin</h1>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {[
              { id: "overview", label: "Overview" },
              { id: "users", label: "All Users" },
              { id: "activity", label: "User Activity" },
              { id: "transactions", label: "Transactions" },
              { id: "content", label: "Content Management" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              ⚠️ {error}
            </p>
          </div>
        )}
        
        {/* Overview Tab */}
        {!loading && activeTab === "overview" && stats && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Users</p>
                <p className="text-3xl font-bold text-foreground">{stats.total_users}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  {stats.farmers_count} farmers, {stats.buyers_count} buyers
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Active Users</p>
                <p className="text-3xl font-bold text-foreground">{stats.active_users}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((stats.active_users / stats.total_users) * 100)}% active
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Transactions</p>
                <p className="text-3xl font-bold text-foreground">{stats.total_transactions}</p>
                <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Revenue</p>
                <p className="text-3xl font-bold text-foreground">₹{stats.revenue / 1000}K</p>
                <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
              </Card>
            </div>

            {/* Recent Activity */}
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

              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {mockTransactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <p className="font-semibold text-foreground">{tx.type}</p>
                        <p className="text-sm text-muted-foreground">{tx.user}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₹{tx.amount}</p>
                        <p
                          className={`text-xs ${
                            tx.status === "completed"
                              ? "text-green-600 dark:text-green-400"
                              : tx.status === "pending"
                                ? "text-orange-600 dark:text-orange-400"
                                : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {!loading && activeTab === "users" && (
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
                <Button>Export CSV</Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{mockUsers.length}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Farmers</p>
                <p className="text-2xl font-bold text-green-600">{mockUsers.filter(u => u.role === "farmer").length}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Buyers</p>
                <p className="text-2xl font-bold text-blue-600">{mockUsers.filter(u => u.role === "buyer").length}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Active Today</p>
                <p className="text-2xl font-bold text-foreground">{mockUsers.filter(u => u.status === "active").length}</p>
              </Card>
            </div>

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
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
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
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* User Activity Tab */}
        {!loading && activeTab === "activity" && activity && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">User Login Activity</h2>

            {/* Activity Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Logins Today</p>
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-xs text-green-600 mt-1">+12% from yesterday</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Active Users Now</p>
                <p className="text-2xl font-bold text-green-600">42</p>
                <p className="text-xs text-muted-foreground mt-1">Online right now</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">New Signups Today</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
                <p className="text-xs text-green-600 mt-1">+3 from yesterday</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Avg. Session Time</p>
                <p className="text-2xl font-bold text-foreground">24m</p>
                <p className="text-xs text-muted-foreground mt-1">Per user</p>
              </Card>
            </div>

            {/* Recent Login Activity */}
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
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Login Count</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers
                      .sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime())
                      .map((user) => (
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
                          <td className="px-6 py-4 text-foreground">
                            <span className="font-semibold">{user.loginCount}</span> times
                          </td>
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

            {/* New Signups */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Recent Signups (Last 7 Days)</h3>
              <div className="space-y-3">
                {mockUsers
                  .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
                  .slice(0, 5)
                  .map((user) => (
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

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Transaction History</h2>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{tx.user}</td>
                        <td className="px-6 py-4 text-foreground">{tx.type}</td>
                        <td className="px-6 py-4 font-semibold text-foreground">₹{tx.amount}</td>
                        <td className="px-6 py-4 text-foreground">{tx.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              tx.status === "completed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : tx.status === "pending"
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {tx.status}
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

        {/* Content Management Tab */}
        {activeTab === "content" && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Content Management</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Weather Data</h3>
                <p className="text-muted-foreground mb-4">Manage weather forecasts and alerts</p>
                <Button className="w-full">Manage Weather</Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Mandi Prices</h3>
                <p className="text-muted-foreground mb-4">Update market prices for crops</p>
                <Button className="w-full">Manage Prices</Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Government Schemes</h3>
                <p className="text-muted-foreground mb-4">Add and update scheme information</p>
                <Button className="w-full">Manage Schemes</Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Farming Tips</h3>
                <p className="text-muted-foreground mb-4">Create and publish farming tips</p>
                <Button className="w-full">Manage Tips</Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  )
}
