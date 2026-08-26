import type React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: {
    section: "users" | "content" | "reports" | "settings"
    action: "view" | "edit" | "create" | "delete"
  }
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredPermission && !hasPermission(requiredPermission.section, requiredPermission.action)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

