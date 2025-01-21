import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface PrivateRouteProps {
  element: React.ReactElement
  roles?: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, roles }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return element
}

export default PrivateRoute

