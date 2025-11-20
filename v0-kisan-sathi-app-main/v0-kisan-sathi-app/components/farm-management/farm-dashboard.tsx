"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { farmApi } from "@/lib/farm-api"

export function FarmDashboard() {
  const [stats, setStats] = useState<any>({
    total_income: 0,
    total_expenses: 0,
    net_profit: 0,
    active_loans: 0,
    low_stock_items: 0,
    active_crop_plans: 0
  })
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [incomeByCrop, setIncomeByCrop] = useState<any[]>([])
  const [recentCrops, setRecentCrops] = useState<any[]>([])
  const [recentLivestock, setRecentLivestock] = useState<any[]>([])
  const [recentLoans, setRecentLoans] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
    fetchMonthlyProfit()
    fetchExpenseByCategory()
    fetchIncomeByCrop()
    fetchRecentData()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setError(null)
      const response = await farmApi.getDashboardStats()
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('Failed to load dashboard stats')
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error)
      setError(error.message || 'Failed to load dashboard stats')
    }
  }

  const fetchMonthlyProfit = async () => {
    try {
      const response = await farmApi.getMonthlyProfit()
      if (response.ok) {
        const data = await response.json()
        setMonthlyData(data)
      }
    } catch (error) {
      console.error('Error fetching monthly profit:', error)
    }
  }

  const fetchExpenseByCategory = async () => {
    try {
      const response = await farmApi.getExpenseByCategory()
      if (response.ok) {
        const data = await response.json()
        setCategoryData(data)
      }
    } catch (error) {
      console.error('Error fetching category data:', error)
    }
  }

  const fetchIncomeByCrop = async () => {
    try {
      const response = await farmApi.getIncomeByCrop()
      if (response.ok) {
        const data = await response.json()
        setIncomeByCrop(data)
      }
    } catch (error) {
      console.error('Error fetching income by crop:', error)
    }
  }

  const fetchRecentData = async () => {
    try {
      const [cropsRes, livestockRes, loansRes] = await Promise.all([
        farmApi.getCropPlans(),
        farmApi.getLivestock(),
        farmApi.getLoans()
      ])
      
      if (cropsRes.ok) {
        const crops = await cropsRes.json()
        setRecentCrops(crops.slice(0, 3))
      }
      
      if (livestockRes.ok) {
        const livestock = await livestockRes.json()
        setRecentLivestock(livestock.slice(0, 3))
      }
      
      if (loansRes.ok) {
        const loans = await loansRes.json()
        setRecentLoans(loans.filter((l: any) => l.status === 'active').slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching recent data:', error)
    }
  }

  const downloadAnalyticsPDF = async () => {
    try {
      const year = new Date().getFullYear()
      const token = localStorage.getItem('kisan-sathi-access')
      
      const response = await fetch(`http://127.0.0.1:8000/farm-management/api/export/analytics/pdf/?year=${year}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to download PDF')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics_${year}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading data</p>
          <p className="text-sm">{error}</p>
          <p className="text-sm mt-2">Please make sure you're logged in. <a href="/login" className="underline">Login here</a></p>
        </div>
      )}
      
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-4xl mb-2">💰</div>
          <p className="text-sm text-muted-foreground mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-600">₹{parseFloat(stats.total_income || 0).toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <div className="text-4xl mb-2">💸</div>
          <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">₹{parseFloat(stats.total_expenses || 0).toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
          <p className={`text-2xl font-bold ${parseFloat(stats.net_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{parseFloat(stats.net_profit || 0).toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Crop Plans</p>
          <p className="text-xl font-bold">{stats.active_crop_plans}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Livestock Items</p>
          <p className="text-xl font-bold text-orange-600">{recentLivestock.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Loans</p>
          <p className="text-xl font-bold">{stats.active_loans}</p>
        </Card>
      </div>

      {/* Monthly Profit Chart */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Monthly Profit Trend</h3>
          <Button variant="outline" size="sm" onClick={downloadAnalyticsPDF}>
            Download Report
          </Button>
        </div>
        {monthlyData.length > 0 ? (
          <div className="space-y-2">
            {monthlyData.map((month, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{month.month}</div>
                <div className="flex-1">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2 text-xs text-white font-semibold"
                        style={{width: `${Math.min(100, (parseFloat(month.total_income) / Math.max(...monthlyData.map((m: any) => parseFloat(m.total_income))) * 100))}%`}}
                      >
                        ₹{parseFloat(month.total_income).toFixed(0)}
                      </div>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div 
                        className="bg-red-500 h-full rounded-full flex items-center justify-end pr-2 text-xs text-white font-semibold"
                        style={{width: `${Math.min(100, (parseFloat(month.total_expense) / Math.max(...monthlyData.map((m: any) => parseFloat(m.total_expense))) * 100))}%`}}
                      >
                        ₹{parseFloat(month.total_expense).toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`w-24 text-right font-bold ${parseFloat(month.profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{parseFloat(month.profit).toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No data available</p>
        )}
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Expense</span>
          </div>
        </div>
      </Card>

      {/* Expense by Category */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Expense Breakdown by Category</h3>
        {categoryData.length > 0 ? (
          <div className="space-y-3">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{cat.category}</span>
                  <span className="text-muted-foreground">
                    ₹{parseFloat(cat.total_amount).toFixed(2)} ({parseFloat(cat.percentage).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-full rounded-full"
                    style={{width: `${cat.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No expense data available</p>
        )}
      </Card>

      {/* Income Breakdown by Category */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-green-600">Income Breakdown by Category</h3>
        {incomeByCrop.length > 0 ? (
          <div className="space-y-3">
            {incomeByCrop.map((crop, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{crop.crop}</span>
                  <span className="text-muted-foreground">
                    ₹{parseFloat(crop.total_amount).toFixed(2)} ({parseFloat(crop.percentage).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-full rounded-full"
                    style={{width: `${crop.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No income data available</p>
        )}
      </Card>

      {/* Recent Crop Plans */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">🌾 Recent Crop Plans</h3>
        {recentCrops.length > 0 ? (
          <div className="space-y-3">
            {recentCrops.map((crop: any) => (
              <div key={crop.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{crop.crop_name}</p>
                  <p className="text-sm text-muted-foreground">{crop.area} acres • {crop.status}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">Planting: {new Date(crop.planting_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No crop plans yet. Add one in the Crops tab!</p>
        )}
      </Card>

      {/* Recent Livestock */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">🐄 Recent Livestock</h3>
        {recentLivestock.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-3">
            {recentLivestock.map((animal: any) => (
              <div key={animal.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{animal.livestock_type_name}</p>
                <p className="text-sm text-muted-foreground">ID: {animal.tag_number}</p>
                <p className="text-sm">Status: <span className="font-medium">{animal.health_status}</span></p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No livestock records yet. Add one in the Livestock tab!</p>
        )}
      </Card>

      {/* Active Loans */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">💳 Active Loans</h3>
        {recentLoans.length > 0 ? (
          <div className="space-y-3">
            {recentLoans.map((loan: any) => (
              <div key={loan.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{loan.loan_source}</p>
                  <p className="text-sm text-muted-foreground">
                    {loan.emi_amount && `EMI: ₹${parseFloat(loan.emi_amount).toLocaleString()}/month`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{parseFloat(loan.loan_amount).toLocaleString()}</p>
                  {loan.interest_rate && <p className="text-sm text-muted-foreground">{loan.interest_rate}% interest</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No active loans. Add one in the Loans tab!</p>
        )}
      </Card>
    </div>
  )
}
