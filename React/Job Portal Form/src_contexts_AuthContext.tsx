import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

interface User {
  id: number
  username: string
  role: "admin" | "jobseeker" | "employer"
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (username: string, password: string, role: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username: string, password: string) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    const foundUser = users.find((u) => u.username === username)

    if (foundUser && password === "password") {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const register = async (username: string, password: string, role: string) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    const newUser: User = {
      id: users.length + 1,
      username,
      role: role as "admin" | "jobseeker" | "employer",
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>
}

