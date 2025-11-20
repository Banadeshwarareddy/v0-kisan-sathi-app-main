"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Send, Loader2, Sparkles, Leaf, Bug, Droplets, Sun, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { useActivityTracker } from "@/hooks/use-activity-tracker"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  audioUrl?: string
}

function ChatbotContent() {
  // Track page visit
  useActivityTracker(
    "AI Assistant",
    "Get farming advice 24/7",
    "💬",
    "/chatbot"
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `ನಮಸ್ಕಾರ! 🙏 I am Kisan Sathi, your expert AI farming assistant for Karnataka.

I can help you with:
🐛 Crop diseases & pest control
🌱 Fertilizer & soil management  
💧 Irrigation advice
🏛️ Government schemes & subsidies
📊 Market prices & crop planning

🎤 You can type or speak your question!
ಯಾವ ಸಹಾಯ ಬೇಕಾದರೂ ಕೇಳಿ! Ask me anything in English or Kannada.`,
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createConversation = async () => {
    try {
      const token = localStorage.getItem('kisan-sathi-access')
      const response = await fetch('http://localhost:8000/api/chatbot/conversations/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: 'New Chat' })
      })
      
      if (response.ok) {
        const data = await response.json()
        setConversationId(data.id)
        return data.id
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
    return null
  }

  // Voice Input: Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await transcribeAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please allow microphone access to use voice input')
    }
  }

  // Voice Input: Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Voice Input: Transcribe Audio using Groq Whisper
  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('kisan-sathi-access')
      
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('language', 'kn') // Kannada, will also detect English

      const response = await fetch('http://localhost:8000/api/chatbot/transcribe/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setInput(data.text)
      } else {
        throw new Error('Transcription failed')
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
      alert('Voice transcription failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Voice Output: Play Audio
  const playAudio = (audioUrl: string, messageId: string) => {
    if (isPlayingAudio === messageId) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setIsPlayingAudio(null)
    } else {
      // Start playing
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      audio.play()
      setIsPlayingAudio(messageId)
      
      audio.onended = () => {
        setIsPlayingAudio(null)
      }
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const token = localStorage.getItem('kisan-sathi-access')
      
      let convId = conversationId
      if (!convId) {
        convId = await createConversation()
        if (!convId) {
          throw new Error('Failed to create conversation')
        }
      }

      const response = await fetch(
        `http://localhost:8000/api/chatbot/conversations/${convId}/send_message/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            message: input,
            generate_audio: true // Request audio generation
          })
        }
      )

      if (response.ok) {
        const data = await response.json()
        const aiMessage: Message = {
          id: data.ai_response.id,
          role: 'assistant',
          content: data.ai_response.content,
          timestamp: data.ai_response.timestamp,
          audioUrl: data.audio_url // Audio URL from backend
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again. ಕ್ಷಮಿಸಿ, ದೋಷ ಸಂಭವಿಸಿದೆ.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickQuestions = [
    { icon: Bug, text: "My tomato leaves have yellow spots", color: "text-red-600" },
    { icon: Leaf, text: "Best organic fertilizer for paddy", color: "text-green-600" },
    { icon: Droplets, text: "How much water for sugarcane?", color: "text-blue-600" },
    { icon: Sun, text: "PM-KISAN scheme details", color: "text-orange-600" }
  ]

  return (
    <>
      <DashboardHeader />
      <DashboardNav />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">Kisan Sathi</h1>
            <Sparkles className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-lg text-gray-600">ರೈತ ಸಹಾಯಕ • AI Farming Assistant with Voice Support</p>
          <p className="text-sm text-gray-500 mt-1">🎤 Speak in English or Kannada • 🔊 Listen to responses</p>
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3 text-center">Quick questions to get started:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((q, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="h-auto py-3 px-4 justify-start text-left hover:bg-green-50 hover:border-green-600"
                  onClick={() => setInput(q.text)}
                >
                  <q.icon className={`h-5 w-5 mr-2 ${q.color}`} />
                  <span className="text-sm">{q.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Container */}
        <Card className="shadow-xl border-2 border-green-600">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                      : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${
                      message.role === 'user' ? 'text-green-100' : 'text-gray-400'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    
                    {/* Voice Output Button for AI messages */}
                    {message.role === 'assistant' && message.audioUrl && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                        onClick={() => playAudio(message.audioUrl!, message.id)}
                      >
                        {isPlayingAudio === message.id ? (
                          <>
                            <VolumeX className="h-4 w-4 mr-1" />
                            <span className="text-xs">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-4 w-4 mr-1" />
                            <span className="text-xs">Listen</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex gap-3">
              {/* Voice Input Button */}
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={`h-12 px-4 ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type or speak your question... ಏನಾದರೂ ಕೇಳಿ..."
                className="flex-1 h-12 text-base"
                disabled={isLoading || isRecording}
              />
              
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim() || isRecording}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-12 px-6"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              🎤 Click mic to speak • 🔊 Click listen button to hear responses • Powered by AI
            </p>
          </div>
        </Card>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🌾 Voice-enabled for Karnataka farmers • English & Kannada support</p>
          <p className="mt-1">Emergency: Raitha Samparka Kendra 📞 080-22212825</p>
        </div>
      </main>
    </>
  )
}

export default function ChatbotPage() {
  return (
    <ProtectedRoute>
      <ChatbotContent />
    </ProtectedRoute>
  )
}
