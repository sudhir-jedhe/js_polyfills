import React, { createContext, useContext, useState, type ReactNode } from "react"

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

const defaultPermissions: Permissions = {
  users: { view: false, edit: false, create: false, delete: false },
  content: { view: false, edit: false, create: false, delete: false },
  reports: { view: false, edit: false, create: false, delete: false },
  settings: { view: false, edit: false, create: false, delete: false },
}

interface AuthContextType {
  isAuthenticated: boolean
  permissions: Permissions
  login: (newPermissions: Permissions) => void
  logout: () => void
  hasPermission: (section: keyof Permissions, action: keyof Permission) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [permissions, setPermissions] = useState<Permissions>(defaultPermissions)

  const login = (newPermissions: Permissions) => {
    setIsAuthenticated(true)
    setPermissions(newPermissions)
  }

  const logout = () => {
    setIsAuthenticated(false)
    setPermissions(defaultPermissions)
  }

  const hasPermission = (section: keyof Permissions, action: keyof Permission) => {
    return permissions[section][action]
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, permissions, login, logout, hasPermission }}>
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

