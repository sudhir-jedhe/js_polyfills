import React from "react"
import { useAuth } from "../contexts/AuthContext"

export function Users() {
  const { hasPermission } = useAuth()

  return (
    <div>
      <h2>Users</h2>
      {hasPermission("users", "view") && <p>User list goes here</p>}
      {hasPermission("users", "create") && <button>Add User</button>}
      {hasPermission("users", "edit") && <button>Edit User</button>}
      {hasPermission("users", "delete") && <button>Delete User</button>}
    </div>
  )
}

