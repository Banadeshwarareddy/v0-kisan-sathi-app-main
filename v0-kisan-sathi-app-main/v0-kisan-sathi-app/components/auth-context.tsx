"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string | number
  email: string
  name: string
  phone?: string
  district?: string
  // Additional farmer profile fields
  first_name?: string
  last_name?: string
  village?: string
  taluk?: string
  land_size?: number | null
  crops_grown?: string[]
  preferred_language?: string
  profile_picture?: string | null
  is_verified?: boolean
  created_at?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (phone: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    name: string,
    phone: string,
    district: string,
    taluk: string,
    village: string
  ) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load user from localStorage on mount
  useEffect(() => {
    if (!mounted) return
    
    try {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem("kisan-sathi-user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error)
    } finally {
      setIsLoading(false)
    }
  }, [mounted])

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000"

  const login = async (phone: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ phone, password }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        // Extract error message from backend response
        let errorMsg = "Login failed. Please check your credentials."
        if (data.errors) {
          if (typeof data.errors === "string") {
            errorMsg = data.errors
          } else if (data.errors.non_field_errors) {
            errorMsg = Array.isArray(data.errors.non_field_errors) 
              ? data.errors.non_field_errors[0] 
              : data.errors.non_field_errors
          } else if (data.errors.phone) {
            errorMsg = Array.isArray(data.errors.phone) 
              ? data.errors.phone[0] 
              : data.errors.phone
          } else if (data.message) {
            errorMsg = data.message
          }
        } else if (data.message) {
          errorMsg = data.message
        }
        throw new Error(errorMsg)
      }
      
      if (!data.success) {
        throw new Error(data.message || "Login failed")
      }
      
      const { access_token, refresh_token, farmer } = data.data

      // Save complete farmer profile data
      const authedUser: User = {
        id: farmer.id,
        email: farmer.email,
        name: farmer.name,
        phone: farmer.phone,
        district: farmer.district,
        // Save all additional profile fields
        first_name: farmer.first_name || farmer.name?.split(' ')[0],
        last_name: farmer.last_name || farmer.name?.split(' ').slice(1).join(' '),
        village: farmer.village,
        taluk: farmer.taluk,
        land_size: farmer.land_size,
        crops_grown: farmer.crops_grown || [],
        preferred_language: farmer.preferred_language || 'en',
        profile_picture: farmer.profile_picture,
        is_verified: farmer.is_verified || false,
        created_at: farmer.created_at,
      }

      setUser(authedUser)
      localStorage.setItem("kisan-sathi-user", JSON.stringify(authedUser))
      localStorage.setItem("kisan-sathi-access", access_token)
      localStorage.setItem("kisan-sathi-refresh", refresh_token)
    } catch (err: any) {
      // Re-throw with the error message for the form to display
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    district: string,
    taluk: string,
    village: string
  ) => {
    setIsLoading(true)
    try {
      const [first_name, ...rest] = name.trim().split(" ")
      const last_name = rest.join(" ") || ""
      const payload = {
        phone: phone.startsWith("+") ? phone : `+91${phone}`,
        email,
        first_name,
        last_name,
        password,
        password2: password,
        district,
        taluk,
        village,
      }
      const res = await fetch(`${API_BASE}/api/auth/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = typeof err?.errors === "string" ? err.errors : JSON.stringify(err?.errors ?? {})
        throw new Error(msg || "Signup failed")
      }
      // Do not auto-login; backend requires OTP verification
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("kisan-sathi-user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
