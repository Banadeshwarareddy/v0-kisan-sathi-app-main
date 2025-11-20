'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Upload, Leaf, Camera, X, CheckCircle2, Sparkles, TrendingUp, 
  Droplets, Zap, Download, Volume2, MapPin, Info, Beaker
} from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardNav } from '@/components/dashboard-nav'

function SoilAnalysisContent() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      setStream(mediaStream)
      setShowCamera(true)
      
      // Wait for next tick to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play().catch(err => console.error('Error playing video:', err))
        }
      }, 100)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'soil-photo.jpg', { type: 'image/jpeg' })
            setSelectedImage(file)
            setImagePreview(canvas.toDataURL('image/jpeg'))
            stopCamera()
          }
        }, 'image/jpeg', 0.95)
      }
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResults(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return
    
    setIsAnalyzing(true)
    
    // Simulate API call
    setTimeout(() => {
      setResults({
        soil_type: 'Red Soil',
        fertility_level: 'High',
        confidence_score: 91.2,
        moisture_level: 'Moderate',
        recommended_crops: ['Cotton', 'Groundnut', 'Sugarcane'],
        fertilizer_suggestions: ['Vermicompost', 'Farm Yard Manure', 'Neem Cake']
      })
      setIsAnalyzing(false)
    }, 3000)
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
                <Beaker className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">AI Soil Analyzer</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mb-4">
              Upload soil images to get instant AI-powered analysis with detailed recommendations for optimal crop growth
            </p>
            <div className="flex flex-wrap gap-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl">Upload Soil Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {showCamera ? (
                  <div className="relative">
                    <video 
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover rounded-lg bg-black"
                    />
                    <div className="flex gap-2 mt-4">
                      <Button 
                        onClick={capturePhoto}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Capture Photo
                      </Button>
                      <Button 
                        onClick={stopCamera}
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                ) : (
                  <div className="relative border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 border-gray-300 dark:border-gray-700 hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-950/50">
                    {imagePreview ? (
                      <div className="relative group">
                        <div className="relative overflow-hidden rounded-xl">
                          <img 
                            src={imagePreview} 
                            alt="Soil sample" 
                            className="max-w-full h-64 object-cover mx-auto rounded-xl shadow-lg"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <p className="text-white font-semibold">Soil Sample Ready</p>
                          </div>
                        </div>
                        <Button
                          onClick={clearImage}
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="relative mb-4">
                          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 rounded-2xl flex items-center justify-center">
                            <Upload className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                          </div>
                        </div>
                        <p className="text-xl font-bold text-foreground mb-2">Upload Soil Sample</p>
                        <p className="text-sm text-muted-foreground mb-6">
                          Take a clear photo of your soil sample for accurate analysis
                        </p>
                        <div className="flex gap-2 justify-center mb-4">
                          <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900 rounded-full text-xs font-medium text-orange-700 dark:text-orange-300">
                            JPG, PNG
                          </div>
                          <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900 rounded-full text-xs font-medium text-amber-700 dark:text-amber-300">
                            Max 10MB
                          </div>
                          <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-full text-xs font-medium text-yellow-700 dark:text-yellow-300">
                            AI Powered
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!imagePreview && (
                      <div className="flex gap-3 justify-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="soil-image"
                        />
                        <label 
                          htmlFor="soil-image" 
                          className="cursor-pointer inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          Choose File
                        </label>
                        <Button
                          onClick={startCamera}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Camera className="w-5 h-5 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      Village
                    </Label>
                    <Input 
                      placeholder="Enter village name" 
                      className="border-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      District
                    </Label>
                    <Input 
                      placeholder="Enter district name" 
                      className="border-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleAnalyze}
                  disabled={!selectedImage || isAnalyzing}
                  className="w-full h-14 text-base font-bold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-full mr-2"></div>
                      Analyzing Soil Sample...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze Soil Sample
                    </>
                  )}
                </Button>

                <div className="p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Tips for Best Results:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Take photos in natural daylight</li>
                        <li>• Ensure soil is visible and in focus</li>
                        <li>• Avoid shadows and reflections</li>
                        <li>• Include location details for better recommendations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl">Analysis Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isAnalyzing ? (
                <div className="text-center py-12">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-orange-200 dark:border-orange-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <Beaker className="absolute inset-0 m-auto w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-2">Analyzing Soil Sample</p>
                  <p className="text-sm text-muted-foreground">Our AI is processing your soil data...</p>
                </div>
              ) : results ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4 rounded-xl border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <p className="text-xs font-medium text-muted-foreground">Soil Type</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">{results.soil_type}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <p className="text-xs font-medium text-muted-foreground">Fertility</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">{results.fertility_level}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-900 p-4 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <p className="text-xs font-medium text-muted-foreground">Confidence</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">{results.confidence_score}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-purple-600" />
                        <p className="text-xs font-medium text-muted-foreground">Moisture</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">{results.moisture_level}</p>
                    </div>
                  </div>

                  <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl border-2 border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                      Recommended Crops
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.recommended_crops.map((crop: string, index: number) => (
                        <span key={index} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <Beaker className="w-5 h-5 text-amber-600" />
                      Fertilizer Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {results.fertilizer_suggestions.map((fertilizer: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{fertilizer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all">
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </Button>
                    <Button className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold shadow-lg hover:shadow-xl transition-all">
                      <Volume2 className="w-5 h-5 mr-2" />
                      Play Audio
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center">
                    <Leaf className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-2">No Results Yet</p>
                  <p className="text-sm text-muted-foreground">Upload a soil image to get instant AI analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

export default function SoilAnalysisPage() {
  return (
    <ProtectedRoute>
      <SoilAnalysisContent />
    </ProtectedRoute>
  )
}
