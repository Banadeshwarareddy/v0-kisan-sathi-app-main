"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { farmApi } from "@/lib/farm-api"
import { Loader2, Trash2, Edit } from "lucide-react"

interface CropPlan {
  id: number
  crop: number
  crop_name: string
  planned_area: string
  planting_date: string
  expected_harvest_date: string
  estimated_cost: string
  estimated_revenue: string
  status: string
  notes: string
}

interface Crop {
  id: number
  name: string
}

export function CropPlanning() {
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([])
  const [crops, setCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    crop: "",
    planned_area: "",
    planting_date: "",
    expected_harvest_date: "",
    estimated_cost: "",
    estimated_revenue: "",
    status: "planned",
    notes: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [plansRes, cropsRes] = await Promise.all([
        farmApi.getCropPlans(),
        farmApi.getCrops()
      ])
      
      if (plansRes.ok) {
        const plansData = await plansRes.json()
        setCropPlans(plansData)
      }
      
      if (cropsRes.ok) {
        const cropsData = await cropsRes.json()
        setCrops(cropsData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.crop || !formData.planned_area || !formData.planting_date) {
      alert('Please fill in all required fields (Crop, Area, and Planting Date)')
      return
    }

    try {
      setSubmitting(true)
      console.log('Submitting crop plan:', formData)
      
      const response = editingId
        ? await farmApi.updateCropPlan(editingId, formData)
        : await farmApi.createCropPlan(formData)

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Success:', result)
        alert(editingId ? 'Crop plan updated successfully!' : 'Crop plan added successfully!')
        await loadData()
        resetForm()
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error response:', errorData)
        alert(`Failed to save crop plan: ${JSON.stringify(errorData)}`)
      }
    } catch (error: any) {
      console.error('Error saving crop plan:', error)
      alert(`Error: ${error.message || 'Failed to save crop plan'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (plan: CropPlan) => {
    setEditingId(plan.id)
    setFormData({
      crop: plan.crop.toString(),
      planned_area: plan.planned_area,
      planting_date: plan.planting_date,
      expected_harvest_date: plan.expected_harvest_date,
      estimated_cost: plan.estimated_cost,
      estimated_revenue: plan.estimated_revenue,
      status: plan.status,
      notes: plan.notes || ""
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this crop plan?')) return

    try {
      const response = await farmApi.deleteCropPlan(id)
      if (response.ok) {
        await loadData()
      }
    } catch (error) {
      console.error('Error deleting crop plan:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      crop: "",
      planned_area: "",
      planting_date: "",
      expected_harvest_date: "",
      estimated_cost: "",
      estimated_revenue: "",
      status: "planned",
      notes: ""
    })
    setEditingId(null)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planned: "bg-blue-100 text-blue-800",
      planted: "bg-green-100 text-green-800",
      growing: "bg-yellow-100 text-yellow-800",
      harvested: "bg-purple-100 text-purple-800",
      failed: "bg-red-100 text-red-800"
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
          {editingId ? "Edit Crop Plan" : "Plan New Crop"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Crop *</Label>
              <Select value={formData.crop} onValueChange={(value) => setFormData({...formData, crop: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop.id} value={crop.id.toString()}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Area (acres) *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter area"
                value={formData.planned_area}
                onChange={(e) => setFormData({...formData, planned_area: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Planting Date *</Label>
              <Input
                type="date"
                value={formData.planting_date}
                onChange={(e) => setFormData({...formData, planting_date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Expected Harvest Date</Label>
              <Input
                type="date"
                value={formData.expected_harvest_date}
                onChange={(e) => setFormData({...formData, expected_harvest_date: e.target.value})}
              />
            </div>
            <div>
              <Label>Estimated Cost (₹)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter estimated cost"
                value={formData.estimated_cost}
                onChange={(e) => setFormData({...formData, estimated_cost: e.target.value})}
              />
            </div>
            <div>
              <Label>Expected Revenue (₹)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter expected revenue"
                value={formData.estimated_revenue}
                onChange={(e) => setFormData({...formData, estimated_revenue: e.target.value})}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="planted">Planted</SelectItem>
                  <SelectItem value="growing">Growing</SelectItem>
                  <SelectItem value="harvested">Harvested</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
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
              {editingId ? "Update Crop Plan" : "Add Crop Plan"}
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
        <h3 className="text-xl font-semibold mb-4">Crop Plans</h3>
        {cropPlans.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No crop plans yet. Add your first crop plan above!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {cropPlans.map((plan) => (
              <Card key={plan.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-lg text-foreground">{plan.crop_name}</h4>
                    <p className="text-sm text-muted-foreground">{plan.area} acres</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(plan.status)}`}>
                    {plan.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm mt-3 text-foreground">
                  <p><span className="font-medium">Planting:</span> {new Date(plan.planting_date).toLocaleDateString()}</p>
                  {plan.expected_harvest_date && (
                    <p><span className="font-medium">Harvest:</span> {new Date(plan.expected_harvest_date).toLocaleDateString()}</p>
                  )}
                  {plan.estimated_cost && (
                    <p><span className="font-medium">Est. Cost:</span> ₹{parseFloat(plan.estimated_cost).toLocaleString()}</p>
                  )}
                  {plan.estimated_revenue && (
                    <p><span className="font-medium">Est. Revenue:</span> ₹{parseFloat(plan.estimated_revenue).toLocaleString()}</p>
                  )}
                  {plan.notes && (
                    <p className="text-muted-foreground italic">{plan.notes}</p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(plan)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(plan.id)}>
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
