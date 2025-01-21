"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: {
    section: "users" | "content" | "reports" | "settings"
    action: "view" | "edit" | "create" | "delete"
  }
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (requiredPermission && !hasPermission(requiredPermission.section, requiredPermission.action)) {
        router.push("/unauthorized")
      }
    }
  }, [isAuthenticated, hasPermission, requiredPermission, router, isLoading])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (
    !isAuthenticated ||
    (requiredPermission && !hasPermission(requiredPermission.section, requiredPermission.action))
  ) {
    return null
  }

  return <>{children}</>
}

