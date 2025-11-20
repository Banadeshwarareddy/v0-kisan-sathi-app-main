"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { farmApi } from "@/lib/farm-api"
import { Loader2, Trash2, Edit } from "lucide-react"

interface Livestock {
  id: number
  livestock_type: number
  livestock_type_name: string
  tag_number: string
  age_months: string | null
  purchase_date: string
  purchase_price: string
  health_status: string
  notes: string
}

interface LivestockType {
  id: number
  name: string
}

export function LivestockManagement() {
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [livestockTypes, setLivestockTypes] = useState<LivestockType[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    livestock_type: "",
    tag_number: "",
    age_months: "",
    purchase_date: "",
    purchase_price: "",
    health_status: "healthy",
    notes: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [livestockRes, typesRes] = await Promise.all([
        farmApi.getLivestock(),
        farmApi.getLivestockTypes()
      ])
      
      if (livestockRes.ok) {
        const livestockData = await livestockRes.json()
        setLivestock(livestockData)
      }
      
      if (typesRes.ok) {
        const typesData = await typesRes.json()
        setLivestockTypes(typesData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.livestock_type || !formData.tag_number) {
      alert('Please fill in all required fields (Animal Type and Tag Number)')
      return
    }

    try {
      setSubmitting(true)
      console.log('Submitting livestock:', formData)
      
      const response = editingId
        ? await farmApi.updateLivestock(editingId, formData)
        : await farmApi.createLivestock(formData)

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Success:', result)
        alert(editingId ? 'Livestock updated successfully!' : 'Livestock added successfully!')
        await loadData()
        resetForm()
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error response:', errorData)
        alert(`Failed to save livestock: ${JSON.stringify(errorData)}`)
      }
    } catch (error: any) {
      console.error('Error saving livestock:', error)
      alert(`Error: ${error.message || 'Failed to save livestock'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (animal: Livestock) => {
    setEditingId(animal.id)
    setFormData({
      livestock_type: animal.livestock_type.toString(),
      tag_number: animal.tag_number,
      age_months: animal.age_months || "",
      purchase_date: animal.purchase_date,
      purchase_price: animal.purchase_price,
      health_status: animal.health_status,
      notes: animal.notes || ""
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this livestock record?')) return

    try {
      const response = await farmApi.deleteLivestock(id)
      if (response.ok) {
        await loadData()
      }
    } catch (error) {
      console.error('Error deleting livestock:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      livestock_type: "",
      tag_number: "",
      age_months: "",
      purchase_date: "",
      purchase_price: "",
      health_status: "healthy",
      notes: ""
    })
    setEditingId(null)
  }

  const getHealthStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      healthy: "bg-green-100 text-green-800",
      sick: "bg-red-100 text-red-800",
      recovering: "bg-yellow-100 text-yellow-800",
      pregnant: "bg-purple-100 text-purple-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Livestock" : "Add Livestock"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Animal Type *</Label>
              <Select value={formData.livestock_type} onValueChange={(value) => setFormData({...formData, livestock_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select animal type" />
                </SelectTrigger>
                <SelectContent>
                  {livestockTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tag/ID Number *</Label>
              <Input
                placeholder="Enter identification number"
                value={formData.tag_number}
                onChange={(e) => setFormData({...formData, tag_number: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Age (months)</Label>
              <Input
                type="number"
                placeholder="Enter age in months"
                value={formData.age_months}
                onChange={(e) => setFormData({...formData, age_months: e.target.value})}
              />
            </div>
            <div>
              <Label>Purchase Date</Label>
              <Input
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
              />
            </div>
            <div>
              <Label>Purchase Price (₹)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter purchase price"
                value={formData.purchase_price}
                onChange={(e) => setFormData({...formData, purchase_price: e.target.value})}
              />
            </div>
            <div>
              <Label>Health Status</Label>
              <Select value={formData.health_status} onValueChange={(value) => setFormData({...formData, health_status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="sick">Sick</SelectItem>
                  <SelectItem value="recovering">Recovering</SelectItem>
                  <SelectItem value="pregnant">Pregnant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Input
                placeholder="Additional notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Update Livestock" : "Add Livestock"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Livestock Records</h3>
        {livestock.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No livestock records yet. Add your first animal above!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {livestock.map((animal) => (
              <Card key={animal.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg">{animal.livestock_type_name}</p>
                    <p className="text-sm text-muted-foreground">ID: {animal.tag_number}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getHealthStatusColor(animal.health_status)}`}>
                    {animal.health_status}
                  </span>
                </div>
                <div className="space-y-1 text-sm mt-3">
                  {animal.age_months && <p><span className="font-medium">Age:</span> {animal.age_months} months</p>}
                  {animal.purchase_date && (
                    <p><span className="font-medium">Purchased:</span> {new Date(animal.purchase_date).toLocaleDateString()}</p>
                  )}
                  {animal.purchase_price && (
                    <p><span className="font-medium">Price:</span> ₹{parseFloat(animal.purchase_price).toLocaleString()}</p>
                  )}
                  {animal.notes && (
                    <p className="text-muted-foreground italic">{animal.notes}</p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(animal)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(animal.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
