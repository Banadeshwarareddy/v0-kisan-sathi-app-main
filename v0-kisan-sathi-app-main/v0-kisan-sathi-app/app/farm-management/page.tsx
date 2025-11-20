"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { FarmDashboard } from "@/components/farm-management/farm-dashboard"
import { ExpenseManagement } from "@/components/farm-management/expense-management"
import { IncomeManagement } from "@/components/farm-management/income-management"
import { CropPlanning } from "@/components/farm-management/crop-planning"
import { LivestockManagement } from "@/components/farm-management/livestock-management"
import { LoanManagement } from "@/components/farm-management/loan-management"
import { useActivityTracker } from "@/hooks/use-activity-tracker"

function FarmManagementContent() {
  // Track page visit
  useActivityTracker(
    "Farm Management",
    "Track expenses, income, inventory & profit for your farm",
    "🌾",
    "/farm-management"
  )
  return (
    <>
      <DashboardHeader />
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Farm Management</h2>
          <p className="text-muted-foreground">Manage your farm expenses, income, crops, livestock, and loans</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="livestock">Livestock</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <FarmDashboard />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseManagement />
          </TabsContent>

          <TabsContent value="income">
            <IncomeManagement />
          </TabsContent>

          <TabsContent value="crops">
            <CropPlanning />
          </TabsContent>

          <TabsContent value="livestock">
            <LivestockManagement />
          </TabsContent>

          <TabsContent value="loans">
            <LoanManagement />
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}

export default function FarmManagementPage() {
  return (
    <ProtectedRoute>
      <FarmManagementContent />
    </ProtectedRoute>
  )
}
