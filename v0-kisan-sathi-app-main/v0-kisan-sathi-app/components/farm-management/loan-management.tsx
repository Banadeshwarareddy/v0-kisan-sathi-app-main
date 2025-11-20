"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { farmApi } from "@/lib/farm-api"
import { Loader2, Trash2, Edit } from "lucide-react"

interface Loan {
  id: number
  lender_name: string
  loan_type: string
  principal_amount: string
  interest_rate: string
  loan_date: string
  emi_amount: string
  tenure_months: number
  status: string
  purpose: string
  remaining_amount?: string
}

export function LoanManagement() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    lender_name: "",
    loan_type: "crop_loan",
    principal_amount: "",
    interest_rate: "",
    loan_date: "",
    emi_amount: "",
    tenure_months: "",
    remaining_amount: "",
    status: "active",
    purpose: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await farmApi.getLoans()
      
      if (response.ok) {
        const data = await response.json()
        setLoans(data)
      }
    } catch (error) {
      console.error('Error loading loans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.lender_name || !formData.principal_amount || !formData.loan_date) {
      alert('Please fill in all required fields (Lender Name, Amount, and Loan Date)')
      return
    }
    
    // Set remaining_amount to principal_amount if not set
    const submitData = {
      ...formData,
      remaining_amount: formData.remaining_amount || formData.principal_amount
    }

    try {
      setSubmitting(true)
      console.log('Submitting loan:', submitData)
      
      const response = editingId
        ? await farmApi.updateLoan(editingId, submitData)
        : await farmApi.createLoan(submitData)

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Success:', result)
        alert(editingId ? 'Loan updated successfully!' : 'Loan added successfully!')
        await loadData()
        resetForm()
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error response:', errorData)
        alert(`Failed to save loan: ${JSON.stringify(errorData)}`)
      }
    } catch (error: any) {
      console.error('Error saving loan:', error)
      alert(`Error: ${error.message || 'Failed to save loan'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (loan: Loan) => {
    setEditingId(loan.id)
    setFormData({
      lender_name: loan.lender_name,
      loan_type: loan.loan_type,
      principal_amount: loan.principal_amount,
      interest_rate: loan.interest_rate,
      loan_date: loan.loan_date,
      emi_amount: loan.emi_amount,
      tenure_months: loan.tenure_months.toString(),
      remaining_amount: loan.remaining_amount || loan.principal_amount,
      status: loan.status,
      purpose: loan.purpose || ""
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this loan record?')) return

    try {
      const response = await farmApi.deleteLoan(id)
      if (response.ok) {
        await loadData()
      }
    } catch (error) {
      console.error('Error deleting loan:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      lender_name: "",
      loan_type: "crop_loan",
      principal_amount: "",
      interest_rate: "",
      loan_date: "",
      emi_amount: "",
      tenure_months: "",
      remaining_amount: "",
      status: "active",
      purpose: ""
    })
    setEditingId(null)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
      defaulted: "bg-red-100 text-red-800"
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
          {editingId ? "Edit Loan" : "Add Loan"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Lender Name *</Label>
              <Input
                placeholder="Bank, Cooperative, etc."
                value={formData.lender_name}
                onChange={(e) => setFormData({...formData, lender_name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Loan Type *</Label>
              <Select value={formData.loan_type} onValueChange={(value) => setFormData({...formData, loan_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crop_loan">Crop Loan</SelectItem>
                  <SelectItem value="equipment_loan">Equipment Loan</SelectItem>
                  <SelectItem value="personal_loan">Personal Loan</SelectItem>
                  <SelectItem value="kisan_credit_card">Kisan Credit Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Loan Amount (₹) *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter loan amount"
                value={formData.principal_amount}
                onChange={(e) => setFormData({...formData, principal_amount: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Interest Rate (%) *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter interest rate"
                value={formData.interest_rate}
                onChange={(e) => setFormData({...formData, interest_rate: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Loan Date *</Label>
              <Input
                type="date"
                value={formData.loan_date}
                onChange={(e) => setFormData({...formData, loan_date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Tenure (months) *</Label>
              <Input
                type="number"
                placeholder="Enter tenure"
                value={formData.tenure_months}
                onChange={(e) => setFormData({...formData, tenure_months: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>EMI Amount (₹) *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter EMI amount"
                value={formData.emi_amount}
                onChange={(e) => setFormData({...formData, emi_amount: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="defaulted">Defaulted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Purpose</Label>
              <Input
                placeholder="Purpose of loan"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Update Loan" : "Add Loan"}
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
        <h3 className="text-xl font-semibold mb-4">Loan Records</h3>
        {loans.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No loans recorded yet. Add your first loan above!</p>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <Card key={loan.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-lg">{loan.lender_name}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Loan Amount</p>
                        <p className="font-semibold">₹{parseFloat(loan.principal_amount).toLocaleString()}</p>
                      </div>
                      {loan.interest_rate && (
                        <div>
                          <p className="text-muted-foreground">Interest Rate</p>
                          <p className="font-semibold">{loan.interest_rate}%</p>
                        </div>
                      )}
                      {loan.emi_amount && (
                        <div>
                          <p className="text-muted-foreground">EMI Amount</p>
                          <p className="font-semibold">₹{parseFloat(loan.emi_amount).toLocaleString()}/month</p>
                        </div>
                      )}
                      {loan.tenure_months && (
                        <div>
                          <p className="text-muted-foreground">Tenure</p>
                          <p className="font-semibold">{loan.tenure_months} months</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">Loan Date</p>
                        <p className="font-semibold">{new Date(loan.loan_date).toLocaleDateString()}</p>
                      </div>
                      {loan.remaining_amount && (
                        <div>
                          <p className="text-muted-foreground">Remaining</p>
                          <p className="font-semibold text-red-600">₹{parseFloat(loan.remaining_amount).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    {loan.purpose && (
                      <p className="text-sm text-muted-foreground italic mt-2">{loan.purpose}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(loan)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(loan.id)}>
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
