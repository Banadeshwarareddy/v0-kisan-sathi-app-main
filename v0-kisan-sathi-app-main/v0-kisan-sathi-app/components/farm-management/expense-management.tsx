"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API_BASE = "http://127.0.0.1:8000/farm-management/api"

export function ExpenseManagement() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [deletedExpenses, setDeletedExpenses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("active")
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  })
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [deletedCount, setDeletedCount] = useState(0)

  useEffect(() => {
    fetchCategories()
    fetchExpenses()
    fetchSummary()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: any = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE}/expense-categories/`, { headers })
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('kisan-sathi-access')
      const headers: any = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE}/expenses/`, { headers })
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
        const total = data.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0)
        setTotalExpenses(total)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  const fetchDeletedExpenses = async () => {
    try {
      const token = localStorage.getItem('kisan-sathi-access')
      if (!token) return
      
      const response = await fetch(`${API_BASE}/expenses/history/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const result = await response.json()
        setDeletedExpenses(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching deleted expenses:', error)
    }
  }

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('kisan-sathi-access')
      if (!token) return
      
      const response = await fetch(`${API_BASE}/expenses/summary/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setDeletedCount(data.deleted_count || 0)
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category) {
      alert('Please select a category')
      return
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    
    setLoading(true)

    try {
      const token = localStorage.getItem('kisan-sathi-access')
      
      if (!token) {
        alert('Please login to add expenses')
        return
      }
      
      const response = await fetch(`${API_BASE}/expenses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message || 'Expense added successfully!')
        setFormData({
          category: "",
          amount: "",
          date: new Date().toISOString().split('T')[0],
          notes: ""
        })
        fetchExpenses()
        fetchSummary()
      } else {
        const errorMsg = result.message || result.detail || 'Failed to add expense'
        alert(errorMsg)
      }
    } catch (error) {
      console.error('Error adding expense:', error)
      alert('Error adding expense')
    } finally {
      setLoading(false)
    }
  }

  const deleteExpense = async (expenseId: number) => {
    if (!confirm('Are you sure you want to delete this expense? You can restore it later from History.')) {
      return
    }

    try {
      const token = localStorage.getItem('kisan-sathi-access')
      if (!token) {
        alert('Please login first')
        return
      }

      const response = await fetch(`${API_BASE}/expenses/${expenseId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const result = await response.json()
      if (response.ok || result.success) {
        alert('Expense deleted successfully')
        fetchExpenses()
        fetchSummary()
      } else {
        alert(result.message || 'Error deleting expense')
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Error deleting expense')
    }
  }

  const restoreExpense = async (expenseId: number) => {
    if (!confirm('Restore this expense?')) {
      return
    }

    try {
      const token = localStorage.getItem('kisan-sathi-access')
      if (!token) {
        alert('Please login first')
        return
      }

      const response = await fetch(`${API_BASE}/expenses/${expenseId}/restore/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      if (result.success) {
        alert('Expense restored successfully')
        fetchDeletedExpenses()
        fetchExpenses()
        fetchSummary()
      } else {
        alert(result.message || 'Error restoring expense')
      }
    } catch (error) {
      console.error('Error restoring expense:', error)
      alert('Error restoring expense')
    }
  }

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem('kisan-sathi-access')
      const headers: any = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE}/export/expenses/pdf/`, { headers })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `expenses_${new Date().toISOString().split('T')[0]}.pdf`
        a.click()
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem('kisan-sathi-access')
      const headers: any = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE}/export/expenses/excel/`, { headers })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `expenses_${new Date().toISOString().split('T')[0]}.xlsx`
        a.click()
      }
    } catch (error) {
      console.error('Error downloading Excel:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-sm opacity-90 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold">₹{totalExpenses.toFixed(2)}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-sm opacity-90 mb-1">Active Records</p>
          <p className="text-3xl font-bold">{expenses.length}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <p className="text-sm opacity-90 mb-1">Deleted Records</p>
          <p className="text-3xl font-bold">{deletedCount}</p>
        </Card>
      </div>

      {/* Add Expense Form */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Amount (₹)</Label>
              <Input 
                type="number"
                step="0.01"
                placeholder="Enter amount" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Input 
                placeholder="Enter notes" 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Expenses List with Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value)
          if (value === 'history') {
            fetchDeletedExpenses()
          }
        }}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="active" className="gap-2">
                📊 Active Expenses
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {expenses.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                📁 History
                <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                  {deletedCount}
                </span>
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadPDF}>Download PDF</Button>
              <Button variant="outline" size="sm" onClick={downloadExcel}>Download Excel</Button>
            </div>
          </div>

          <TabsContent value="active">
            {expenses.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No expenses recorded yet</p>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-start p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{expense.category_name}</p>
                      <p className="text-sm text-muted-foreground">{expense.notes || 'No notes'}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(expense.date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-red-600 text-xl">₹{parseFloat(expense.amount).toFixed(2)}</p>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteExpense(expense.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {deletedExpenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No deleted expenses</p>
                <p className="text-sm text-muted-foreground mt-2">Deleted expenses will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deletedExpenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-start p-4 border rounded-lg bg-orange-50 border-orange-200 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{expense.category_name}</p>
                      <p className="text-sm text-muted-foreground">{expense.notes || 'No notes'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Date: {new Date(expense.date).toLocaleDateString('en-IN')} | 
                        Deleted: {new Date(expense.deleted_at).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-red-600 text-xl">₹{parseFloat(expense.amount).toFixed(2)}</p>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => restoreExpense(expense.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        ↩️ Restore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
