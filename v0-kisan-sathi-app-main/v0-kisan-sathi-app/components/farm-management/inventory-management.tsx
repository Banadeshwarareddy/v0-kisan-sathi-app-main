"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_BASE = "http://127.0.0.1:8000/farm-management/api"

export function InventoryManagement() {
  const [inventory, setInventory] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    brand: "",
    current_stock: "",
    unit: "kg",
    minimum_stock: "",
    cost_per_unit: ""
  })

  useEffect(() => {
    fetchCategories()
    fetchInventory()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE}/inventory-categories/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE}/inventory/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setInventory(data)
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE}/inventory/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message || 'Inventory item added successfully!')
        setFormData({
          category: "",
          name: "",
          brand: "",
          current_stock: "",
          unit: "kg",
          minimum_stock: "",
          cost_per_unit: ""
        })
        fetchInventory()
      } else {
        alert('Failed to add inventory item')
      }
    } catch (error) {
      console.error('Error adding inventory:', error)
      alert('Error adding inventory item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Add Inventory Item</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Item Name</Label>
              <Input 
                placeholder="Enter item name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Brand (Optional)</Label>
              <Input 
                placeholder="Enter brand" 
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              />
            </div>
            <div>
              <Label>Current Stock</Label>
              <Input 
                type="number" 
                step="0.01"
                placeholder="Enter quantity" 
                value={formData.current_stock}
                onChange={(e) => setFormData({...formData, current_stock: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="bottle">Bottle</SelectItem>
                  <SelectItem value="packet">Packet</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Minimum Stock Alert</Label>
              <Input 
                type="number" 
                step="0.01"
                placeholder="Minimum quantity" 
                value={formData.minimum_stock}
                onChange={(e) => setFormData({...formData, minimum_stock: e.target.value})}
              />
            </div>
            <div>
              <Label>Cost per Unit (₹)</Label>
              <Input 
                type="number" 
                step="0.01"
                placeholder="Enter cost" 
                value={formData.cost_per_unit}
                onChange={(e) => setFormData({...formData, cost_per_unit: e.target.value})}
              />
            </div>
          </div>
          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? 'Adding...' : 'Add to Inventory'}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Current Inventory</h3>
        {inventory.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No inventory items yet</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((item) => (
              <Card key={item.id} className={`p-4 ${item.is_low_stock ? 'border-red-500 border-2' : ''}`}>
                <p className="font-semibold">{item.name}</p>
                {item.brand && <p className="text-sm text-muted-foreground">{item.brand}</p>}
                <p className="text-2xl font-bold text-foreground mt-2">
                  {parseFloat(item.current_stock).toFixed(2)} {item.unit}
                </p>
                <p className="text-sm text-muted-foreground">
                  Min: {parseFloat(item.minimum_stock).toFixed(2)} {item.unit}
                </p>
                {item.is_low_stock && (
                  <p className="text-xs text-red-600 font-semibold mt-1">⚠️ Low Stock Alert</p>
                )}
                <p className="text-sm mt-2">Value: ₹{parseFloat(item.total_value).toFixed(2)}</p>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
