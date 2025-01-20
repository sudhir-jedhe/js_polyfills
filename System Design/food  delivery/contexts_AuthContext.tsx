'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'restaurant_owner'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (e.g., by verifying a token in localStorage)
    const checkLoggedIn = async () => {
      try {
        // In a real app, you would verify the token with your backend
        const token = localStorage.getItem('token')
        if (token) {
          // Fetch user data
          const userData = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer' as const }
          setUser(userData)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, you would send a request to your backend to authenticate
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const userData = { id: '1', name: 'John Doe', email, role: 'customer' as const }
      setUser(userData)
      localStorage.setItem('token', 'fake-jwt-token')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

