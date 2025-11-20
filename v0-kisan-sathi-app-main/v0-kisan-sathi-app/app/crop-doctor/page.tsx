"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { 
  Upload, Camera, X, CheckCircle2, Sparkles, AlertCircle, Info, Leaf, Download, Volume2
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
  status: ImageStatus
  progress: number
  result?: DiseaseResult
  errorMessage?: string
}

function CropDoctorContent() {
  const [items, setItems] = useState<UploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const [cropType, setCropType] = useState<string>("")
  const [customCrop, setCustomCrop] = useState<string>("")
  const [history, setHistory] = useState<any[]>([])
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000"
  const [analysisId, setAnalysisId] = useState<number | null>(null)
  const [language, setLanguage] = useState<"en" | "kn">("en")

  const canAddMore = items.length < 5
  const canAnalyze = useMemo(() => items.some((i) => i.status === "ready" || i.status === "idle"), [items])
  const analyzedItems = items.filter((i) => i.status === "done")

  const generateId = () => Math.random().toString(36).slice(2)

  const compressImage = (file: File, maxSize = 1200, quality = 0.75): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          let { width, height } = img
          const scale = Math.min(1, maxSize / Math.max(width, height))
          width = Math.round(width * scale)
          height = Math.round(height * scale)
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          if (!ctx) return reject(new Error("Canvas context not available"))
          ctx.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL("image/jpeg", quality)
          resolve(dataUrl)
        }
        img.onerror = () => reject(new Error("Failed to load image for compression"))
        img.src = reader.result as string
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  const addFiles = useCallback(async (files: FileList | File[]) => {
    if (!files || files.length === 0) return
    const remainingSlots = 5 - items.length
    const list = Array.from(files).slice(0, Math.max(0, remainingSlots))
    if (list.length === 0) return

    // Seed items in compressing state for instant UI feedback
    const seeded: UploadItem[] = await Promise.all(
      list.map(async (file) => {
        const tempSrc = URL.createObjectURL(file)
        return {
          id: generateId(),
          name: file.name,
          originalSrc: tempSrc,
          src: tempSrc,
          status: "compressing",
          progress: 0,
        }
      })
    )
    setItems((prev) => [...prev, ...seeded])

    // Compress in background and update each item
    await Promise.all(
      list.map(async (file, index) => {
        const itemId = seeded[index].id
        try {
          const compressed = await compressImage(file)
          setItems((prev) =>
            prev.map((it) => (it.id === itemId ? { ...it, src: compressed, status: "ready", progress: 0 } : it))
          )
        } catch (err) {
          setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, status: "error", errorMessage: "Compression failed" } : it)))
        }
      })
    )
  }, [items.length])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
    // reset to allow re-selecting the same files
    if (inputRef.current) inputRef.current.value = ""
  }

  const onCameraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const onDragLeave = () => setIsDragging(false)
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!canAddMore) return
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files)
    }
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    setCompareIds((prev) => prev.filter((cid) => cid !== id))
  }

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  const analyzeAll = async () => {
    const queue = items.filter((i) => i.status === "ready" || i.status === "idle")
    if (queue.length === 0) return
    // mark all queued as analyzing
    setItems((prev) => prev.map((i) => (queue.find((q) => q.id === i.id) ? { ...i, status: "analyzing", progress: 10 } : i)))
    const form = new FormData()
    const selectedCrop = cropType === "__custom__" ? customCrop.trim() : cropType
    form.append("crop_type", selectedCrop)
    form.append("language", language)
    // append images in the same order as items
    for (const it of queue) {
      // convert dataURL to blob
      const res = await fetch(it.src)
      const blob = await res.blob()
      form.append("images", blob, it.name || `image_${it.id}.jpg`)
    }
    try {
      const resp = await fetch(`${API_BASE}/api/crop-doctor/analyze/`, {
        method: "POST",
        body: form,
      })
      if (!resp.ok) throw new Error("Analyze failed")
      const json = await resp.json()
      if (!json.success) throw new Error(json.message || "Analyze failed")
      const analysis = json.analysis
      setAnalysisId(analysis.id)
      const results: DiseaseResult[] = (analysis.result?.items || [])
      // Assign results in order to queued items
      setItems((prev) => {
        const next = [...prev]
        let rIndex = 0
        for (let i = 0; i < next.length; i++) {
          if (queue.find((q) => q.id === next[i].id)) {
            const r = results[rIndex]
            next[i] = { ...next[i], status: "done", progress: 100, result: r }
            rIndex++
          }
        }
        return next
      })
    } catch (e) {
      setItems((prev) => prev.map((i) => (queue.find((q) => q.id === i.id) ? { ...i, status: "error", errorMessage: "Analysis failed" } : i)))
    }
  }

  // Simple image editing helpers
  const rotateImage = (dataUrl: string, degrees: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("Canvas context not available"))
        const radians = (degrees * Math.PI) / 180
        const sin = Math.abs(Math.sin(radians))
        const cos = Math.abs(Math.cos(radians))
        const newWidth = Math.round(img.width * cos + img.height * sin)
        const newHeight = Math.round(img.width * sin + img.height * cos)
        canvas.width = newWidth
        canvas.height = newHeight
        ctx.translate(newWidth / 2, newHeight / 2)
        ctx.rotate(radians)
        ctx.drawImage(img, -img.width / 2, -img.height / 2)
        resolve(canvas.toDataURL("image/jpeg", 0.9))
      }
      img.onerror = () => reject(new Error("Failed to rotate image"))
      img.src = dataUrl
    })
  }

  const cropCenterSquare = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const size = Math.min(img.width, img.height)
        const sx = Math.floor((img.width - size) / 2)
        const sy = Math.floor((img.height - size) / 2)
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("Canvas context not available"))
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size)
        resolve(canvas.toDataURL("image/jpeg", 0.9))
      }
      img.onerror = () => reject(new Error("Failed to crop image"))
      img.src = dataUrl
    })
  }

  const editRotate = async (id: string) => {
    const it = items.find((x) => x.id === id)
    if (!it) return
    const rotated = await rotateImage(it.src, 90)
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, src: rotated } : x)))
  }

  const editCrop = async (id: string) => {
    const it = items.find((x) => x.id === id)
    if (!it) return
    const cropped = await cropCenterSquare(it.src)
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, src: cropped } : x)))
  }

  // Kannada TTS for treatment
  const speakText = (text: string, lang = "kn-IN") => {
    try {
      if (!("speechSynthesis" in window)) return
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = lang
      const voices = window.speechSynthesis.getVoices()
      const knVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("kn"))
      if (knVoice) utter.voice = knVoice
      window.speechSynthesis.speak(utter)
    } catch {}
  }

  // History in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cropDoctorHistory")
      if (raw) setHistory(JSON.parse(raw))
    } catch {}
  }, [])

  const saveToHistory = (it: UploadItem) => {
    if (!it.result) return
    const selectedCrop = cropType === "__custom__" ? customCrop.trim() : cropType
    const entry = {
      id: it.id,
      name: it.name,
      src: it.src,
      cropType: selectedCrop || "",
      result: it.result,
      savedAt: Date.now(),
    }
    const next = [entry, ...history].slice(0, 50)
    setHistory(next)
    try {
      localStorage.setItem("cropDoctorHistory", JSON.stringify(next))
    } catch {}
  }

  return (
    <>
      <DashboardHeader />
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section with Gradient */}
        <div className="relative mb-8 p-8 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-900 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 dark:bg-orange-800 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-200 dark:bg-yellow-800 rounded-full blur-3xl opacity-20 -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-foreground">AI Crop Detector</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Upload photos of your crops to instantly identify diseases and receive expert treatment recommendations powered by AI
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>Scientific Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>Expert Recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>PDF & Audio Reports</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl">Upload Crop Images</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    Select Crop Type
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full border-2 rounded-lg px-4 py-3 bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    <option value="">Choose crop (improves accuracy)</option>
                    <option value="Tomato">🍅 Tomato</option>
                    <option value="Potato">🥔 Potato</option>
                    <option value="Rice">🌾 Rice</option>
                    <option value="Wheat">🌾 Wheat</option>
                    <option value="Maize">🌽 Maize</option>
                    <option value="Cotton">☁️ Cotton</option>
                    <option value="__custom__">✏️ Other (type manually)</option>
                  </select>
                  {cropType === "__custom__" && (
                    <input
                      type="text"
                      value={customCrop}
                      onChange={(e) => setCustomCrop(e.target.value)}
                      placeholder="Enter crop name"
                      className="mt-3 w-full border-2 rounded-lg px-4 py-3 bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Result Language
                  </label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as any)} 
                    className="border-2 rounded-lg px-4 py-2 bg-background text-foreground font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="en">🇬🇧 English</option>
                    <option value="kn">🇮🇳 ಕನ್ನಡ</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`relative border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragging 
                      ? "border-green-500 bg-green-50 dark:bg-green-950 scale-105 shadow-lg" 
                      : "border-gray-300 dark:border-gray-700 hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-950/50"
                  } ${canAddMore ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
                  onClick={() => canAddMore && inputRef.current?.click()}
                >
                  <div className="relative">
                    <div className={`text-6xl mb-4 transition-transform duration-300 ${isDragging ? "scale-110" : ""}`}>
                      {isDragging ? "📥" : "📸"}
                    </div>
                    <p className="text-xl font-bold text-foreground mb-2">
                      {isDragging ? "Drop your images here!" : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      PNG, JPG, JPEG • Maximum 5 images • Up to 10MB each
                    </p>
                    <div className="flex gap-3 justify-center">
                      <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs font-medium text-blue-700 dark:text-blue-300">
                        High Quality
                      </div>
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full text-xs font-medium text-green-700 dark:text-green-300">
                        Fast Analysis
                      </div>
                      <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300">
                        Secure
                      </div>
                    </div>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onInputChange}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={onCameraInputChange}
                    className="hidden"
                  />
                </div>
              </div>

              {items.length > 0 && (
                <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {items.map((it) => (
                    <div key={it.id} className="relative">
                      <img
                        src={it.src || "/placeholder.svg"}
                        alt={it.name}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <div className="absolute inset-x-0 bottom-0">
                        {(it.status === "analyzing" || (it.progress > 0 && it.progress < 100)) && (
                          <div className="h-1 w-full bg-muted rounded-b-lg overflow-hidden">
                            <div
                              className="h-1 bg-primary"
                              style={{ width: `${it.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-2 left-2 flex gap-1">
                        {it.status === "done" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-600 text-white">Done</span>
                        )}
                        {it.status === "compressing" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-600 text-white">Compressing</span>
                        )}
                        {it.status === "analyzing" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white">Analyzing</span>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editRotate(it.id)}>
                          Rotate
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => editCrop(it.id)}>
                          Crop
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => removeItem(it.id)}>
                          Delete
                        </Button>
                      </div>
                      {it.status === "done" && (
                        <div className="absolute bottom-2 right-2 flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => toggleCompare(it.id)}>
                            {compareIds.includes(it.id) ? "Selected" : "Compare"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={analyzeAll} 
                  disabled={!canAnalyze} 
                  className="h-14 text-base font-bold flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canAnalyze ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze All Images
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Upload Images First
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  disabled={!canAddMore}
                  className="h-14 text-base font-semibold border-2 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Add More
                </Button>
                <Button
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                  className="h-14 text-base font-semibold border-2 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Camera
                </Button>
              </div>

              <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Pro Tips for Best Results:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Take clear, well-lit photos of affected plant parts</li>
                      <li>• Focus on diseased leaves, stems, or fruits</li>
                      <li>• Avoid blurry or dark images</li>
                      <li>• Multiple angles help improve accuracy</li>
                    </ul>
                  </div>
                </div>
              </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl">Analysis Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {analyzedItems.length > 0 ? (
                <div className="space-y-6">
                  {analyzedItems.map((it) => (
                    <div key={it.id} className="space-y-4">
                      {/* Image Preview */}
                      <div className="relative group">
                        <img 
                          src={it.src} 
                          alt={it.name} 
                          className="w-full h-64 object-cover rounded-xl shadow-md"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {it.result && (
                        <>
                          {/* Disease Info Cards */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-xl border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
                              <div className="flex items-center gap-2 mb-2">
                                <Leaf className="w-4 h-4 text-green-600" />
                                <p className="text-xs font-medium text-muted-foreground">Disease</p>
                              </div>
                              <p className="text-lg font-bold text-foreground">{it.result.disease.en}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-xs font-medium text-muted-foreground">Cause</p>
                              </div>
                              <p className="text-sm text-foreground line-clamp-2">{language === "kn" ? it.result.cause.kn : it.result.cause.en}</p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-900 p-4 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-shadow">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <p className="text-xs font-medium text-muted-foreground">Confidence</p>
                              </div>
                              <p className="text-lg font-bold text-foreground">{it.result.confidence}%</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-purple-600" />
                                <p className="text-xs font-medium text-muted-foreground">Severity</p>
                              </div>
                              <p className="text-lg font-bold text-foreground">{it.result.severity.charAt(0).toUpperCase() + it.result.severity.slice(1)}</p>
                            </div>
                          </div>
                          {/* Treatment Section */}
                          <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl border-2 border-green-200 dark:border-green-800 mb-4">
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Recommended Treatment
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">IMMEDIATE</p>
                                <ul className="space-y-1">
                                  {(language === "kn" ? it.result.treatment.immediate.kn : it.result.treatment.immediate.en).map((t, idx) => (
                                    <li key={"im"+idx} className="flex items-start gap-2 text-sm">
                                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-foreground">{t}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">CHEMICAL</p>
                                <ul className="space-y-1">
                                  {(language === "kn" ? it.result.treatment.chemical.kn : it.result.treatment.chemical.en).map((t, idx) => (
                                    <li key={"ch"+idx} className="flex items-start gap-2 text-sm">
                                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-foreground">{t}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">ORGANIC</p>
                                <ul className="space-y-1">
                                  {(language === "kn" ? it.result.treatment.organic.kn : it.result.treatment.organic.en).map((t, idx) => (
                                    <li key={"or"+idx} className="flex items-start gap-2 text-sm">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-foreground">{t}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Key Recommendations Section */}
                          <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-xl border-2 border-amber-200 dark:border-amber-800 mb-4">
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Quick Action Steps
                            </h4>
                            <ul className="space-y-2">
                              {(language === "kn" ? it.result.treatment.immediate.kn : it.result.treatment.immediate.en).slice(0, 3).map((action, idx) => (
                                <li key={"qa"+idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-foreground font-medium">{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Prevention Section */}
                          <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl border-2 border-blue-200 dark:border-blue-800 mb-4">
                            <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Prevention Tips
                            </h4>
                            <ul className="space-y-2">
                              {(language === "kn" ? it.result.prevention.kn : it.result.prevention.en).map((p, idx) => (
                                <li key={"pr"+idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-foreground">{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => saveToHistory(it)}
                              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                              <Download className="w-5 h-5 mr-2" />
                              Download PDF
                            </Button>
                            <Button 
                              onClick={() => speakText((it.result.treatment.immediate[language] || []).concat(it.result.treatment.chemical[language] || [], it.result.treatment.organic[language] || []).join(". "), language === "kn" ? "kn-IN" : "en-US")}
                              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                              <Volume2 className="w-5 h-5 mr-2" />
                              Play Audio
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-2">No Results Yet</p>
                  <p className="text-sm text-muted-foreground">Upload crop images and analyze to see disease detection results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

export default function CropDoctorPage() {
  return (
    <ProtectedRoute>
      <CropDoctorContent />
    </ProtectedRoute>
  )
}
