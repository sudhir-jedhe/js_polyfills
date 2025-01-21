import React from "react"
import { useAuth } from "../contexts/AuthContext"

export function Settings() {
  const { hasPermission } = useAuth()

  return (
    <div>
      <h2>Settings</h2>
      {hasPermission("settings", "view") && <p>Settings options go here</p>}
      {hasPermission("settings", "edit") && <button>Edit Settings</button>}
      {hasPermission("settings", "create") && <button>Add Setting</button>}
      {hasPermission("settings", "delete") && <button>Delete Setting</button>}
    </div>
  )
}

