"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface Permission {
  view: boolean
  edit: boolean
  create: boolean
  delete: boolean
}

interface Permissions {
  users: Permission
  content: Permission
  reports: Permission
  settings: Permission
}

interface AuthContextType {
  isAuthenticated: boolean
  permissions: Permissions
  login: (username: string, password: string, csrfToken: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (section: keyof Permissions, action: keyof Permission) => boolean
  error: string | null
  isLoading: boolean
}

const defaultPermissions: Permissions = {
  users: { view: false, edit: false, create: false, delete: false },
  content: { view: false, edit: false, create: false, delete: false },
  reports: { view: false, edit: false, create: false, delete: false },
  settings: { view: false, edit: false, create: false, delete: false },
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [permissions, setPermissions] = useState<Permissions>(defaultPermissions)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/status")
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(data.isAuthenticated)
        setPermissions(data.permissions)
      } else {
        setIsAuthenticated(false)
        setPermissions(defaultPermissions)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      setError("Failed to check authentication status")
      setIsAuthenticated(false)
      setPermissions(defaultPermissions)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string, csrfToken: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, csrfToken }),
      })
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        setPermissions(data.permissions)
        router.push("/dashboard")
      } else {
        throw new Error("Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (response.ok) {
        setIsAuthenticated(false)
        setPermissions(defaultPermissions)
        router.push("/login")
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
      setError("Logout failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const hasPermission = (section: keyof Permissions, action: keyof Permission) => {
    return permissions[section][action]
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, permissions, login, logout, hasPermission, error, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

