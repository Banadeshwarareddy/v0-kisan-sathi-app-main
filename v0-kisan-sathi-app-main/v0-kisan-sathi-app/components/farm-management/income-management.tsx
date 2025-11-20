"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API_BASE = "http://127.0.0.1:8000/farm-management/api"

export function IncomeManagement() {
  const [income, setIncome] = useState<any[]>([])
  const [deletedIncome, setDeletedIncome] = useState<any[]>([])
  const [crops, setCrops] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("active")
  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    unit: "kg",
    rate_per_unit: "",
    buyer_name: "",
    sale_date: new Date().toISOString().split('T')[0],
    payment_status: "pending",
    notes: ""
  })
  const [totalIncome, setTotalIncome] = useState(0)
  const [deletedCount, setDeletedCount] = useState(0)

  useEffect(() => {
    fetchCrops()
    fetchIncome()
    fetchSummary()
  }, [])

  const fetchCrops = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: any = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE}/crops/`, { headers })
      if (response.ok) {
        const data = await response.json()
        setCrops(data)
      }
    } catch (error) {
      console.error('Error fetching crops:', error)
    }
  }

  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem('kisan-sathi-access')
      const headers: any = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE}/income/`, { headers })
      if (response.ok) {
        const data = await response.json()
        setIncome(data)
        const total = data.reduce((sum: number, inc: any) => sum + parseFloat(inc.total_amount), 0)
        setTotalIncome(total)
      }
    } catch (error) {
      console.error('Error fetching income:', error)
    }
  }

  const fetchDeletedIncome = async () => {
    try {
      const token = localStorage.getItem('kisan-sathi-access')
      if (!token) return
      
      const response = await fetch(`${API_BASE}/income/history/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const result = await response.json()
        setDeletedIncome(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching deleted income:', error)
    }
  }

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('kisan-sathi-access')
      if (!token) return
      
      const response = await fetch(`${API_BASE}/income/summary/`, {
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
    
    if (!formData.crop) {
      alert('Please select a crop')
      return
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      alert('Please enter a valid quantity')
      return
    }
    if (!formData.rate_per_unit || parseFloat(formData.rate_per_unit) <= 0) {
      alert('Please enter a valid rate per unit')
      return
    }
    if (!formData.buyer_name.trim()) {
      alert('Please enter buyer name')
      return
    }
    
    setLoading(true)

    try {
      const token = localStorage.getItem('kisan-sathi-access')
      if (!token) {
        alert('Please login to record income')
        return
      }
      const response = await fetch(`${API_BASE}/income/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message || 'Income recorded successfully!')
        setFormData({
          crop: "",
          quantity: "",
          unit: "kg",
          rate_per_unit: "",
          buyer_name: "",
          sale_date: new Date().toISOString().split('T')[0],
          payment_status: "pending",
          notes: ""
        })
        fetchIncome()
        fetchSummary()
      } else {
        const errorMsg = result.message || result.detail || 'Failed to record income'
        alert(errorMsg)
      }
    } catch (error) {
      console.error('Error recording income:', error)
      alert('Error recording income')
    } finally {
      setLoading(false)
    }
  }

  const deleteIncome = async (incomeId: number) => {
    if (!confirm('Are you sure you want to delete this income record? You can restore it later from History.')) {
      return
    }

    try {
      const token = localStorage.getItem('kisan-sathi-access')
      if (!token) {
        alert('Please login first')
        return
      }

      const response = await fetch(`${API_BASE}/income/${incomeId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const result = await response.json()
      if (response.ok || result.success) {
        alert('Income deleted successfully')
        fetchIncome()
        fetchSummary()
      } else {
        alert(result.message || 'Error deleting income')
      }
    } catch (error) {
      console.error('Error deleting income:', error)
      alert('Error deleting income')
    }
  }

  const restoreIncome = async (incomeId: number) => {
    if (!confirm('Restore this income record?')) {
      return
    }

    try {
      const token = localStorage.getItem('kisan-sathi-access')
      if (!token) {
        alert('Please login first')
        return
      }

      const response = await fetch(`${API_BASE}/income/${incomeId}/restore/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      if (result.success) {
        alert('Income restored successfully')
        fetchDeletedIncome()
        fetchIncome()
        fetchSummary()
      } else {
        alert(result.message || 'Error restoring income')
      }
    } catch (error) {
      console.error('Error restoring income:', error)
      alert('Error restoring income')
    }
  }

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem('kisan-sathi-access')
      const headers: any = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE}/export/income/pdf/`, { headers })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `income_${new Date().toISOString().split('T')[0]}.pdf`
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
      const response = await fetch(`${API_BASE}/export/income/excel/`, { headers })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `income_${new Date().toISOString().split('T')[0]}.xlsx`
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
        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-sm opacity-90 mb-1">Total Income</p>
          <p className="text-3xl font-bold">₹{totalIncome.toFixed(2)}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-sm opacity-90 mb-1">Active Records</p>
          <p className="text-3xl font-bold">{income.length}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <p className="text-sm opacity-90 mb-1">Deleted Records</p>
          <p className="text-3xl font-bold">{deletedCount}</p>
        </Card>
      </div>

      {/* Record Income Form */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Record Income</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Crop *</Label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={formData.crop}
                onChange={(e) => setFormData({...formData, crop: e.target.value})}
                required
              >
                <option value="">Select crop</option>
                {crops.map((crop) => (
                  <option key={crop.id} value={crop.id.toString()}>{crop.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input 
                type="number" 
                step="0.01"
                placeholder="Enter quantity" 
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Unit *</Label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                required
              >
                <option value="kg">Kilogram</option>
                <option value="quintal">Quintal</option>
                <option value="ton">Ton</option>
                <option value="bag">Bag</option>
              </select>
            </div>
            <div>
              <Label>Rate per Unit (₹)</Label>
              <Input 
                type="number" 
                step="0.01"
                placeholder="Enter rate" 
                value={formData.rate_per_unit}
                onChange={(e) => setFormData({...formData, rate_per_unit: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Buyer Name</Label>
              <Input 
                placeholder="Enter buyer name" 
                value={formData.buyer_name}
                onChange={(e) => setFormData({...formData, buyer_name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Sale Date</Label>
              <Input 
                type="date" 
                value={formData.sale_date}
                onChange={(e) => setFormData({...formData, sale_date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Payment Status *</Label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={formData.payment_status}
                onChange={(e) => setFormData({...formData, payment_status: e.target.value})}
                required
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="completed">Completed</option>
              </select>
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
              {loading ? 'Recording...' : 'Record Income'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Income List with Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value)
          if (value === 'history') {
            fetchDeletedIncome()
          }
        }}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="active" className="gap-2">
                📊 Active Income
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {income.length}
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
            {income.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No income recorded yet</p>
            ) : (
              <div className="space-y-3">
                {income.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{item.crop_name}</p>
                      <p className="text-sm text-muted-foreground">{item.buyer_name} • {item.quantity} {item.unit} • {item.payment_status}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(item.sale_date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-green-600 text-xl">₹{parseFloat(item.total_amount).toFixed(2)}</p>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteIncome(item.id)}
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
            {deletedIncome.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No deleted income records</p>
                <p className="text-sm text-muted-foreground mt-2">Deleted income records will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deletedIncome.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-4 border rounded-lg bg-orange-50 border-orange-200 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{item.crop_name}</p>
                      <p className="text-sm text-muted-foreground">{item.buyer_name} • {item.quantity} {item.unit} • {item.payment_status}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Date: {new Date(item.sale_date).toLocaleDateString('en-IN')} | 
                        Deleted: {new Date(item.deleted_at).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-green-600 text-xl">₹{parseFloat(item.total_amount).toFixed(2)}</p>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => restoreIncome(item.id)}
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
