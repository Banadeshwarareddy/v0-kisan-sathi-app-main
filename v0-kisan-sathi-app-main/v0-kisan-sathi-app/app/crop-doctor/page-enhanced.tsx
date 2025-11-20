"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { 
  Upload, Camera, X, RotateCw, Crop, AlertCircle, CheckCircle2, 
  Loader2, Download, Volume2, MapPin, Phone, Navigation, Sparkles,
  TrendingUp, Shield, Leaf, Droplets, Bug, Info
} from "lucide-react"

interface BilingualText {
  en: string
  kn: string
}

interface BilingualList {
  en: string[]
  kn: string[]
}

interface DiseaseResult {
  disease: BilingualText
  confidence: number
  severity: "low" | "medium" | "high"
  cause: BilingualText
  treatment: {
    immediate: BilingualList
    chemical: BilingualList
    organic: BilingualList
  }
  prevention: BilingualList
}

type ImageStatus = "idle" | "compressing" | "ready" | "analyzing" | "done" | "error"

interface UploadItem {
  id: string
  name: string
  originalSrc: string
  src: string
