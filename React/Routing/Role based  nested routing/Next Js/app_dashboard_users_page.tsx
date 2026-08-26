import { ProtectedRoute } from "../../components/ProtectedRoute"
import { Users } from "../../components/Users"

export default function UsersPage() {
  return (
    <ProtectedRoute requiredPermission={{ section: "users", action: "view" }}>
      <Users />
    </ProtectedRoute>
  )
}

