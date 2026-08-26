import React from "react"
import { useAuth } from "../contexts/AuthContext"

export function Content() {
  const { hasPermission } = useAuth()

  return (
    <div>
      <h2>Content</h2>
      {hasPermission("content", "view") && <p>Content list goes here</p>}
      {hasPermission("content", "create") && <button>Create Content</button>}
      {hasPermission("content", "edit") && <button>Edit Content</button>}
      {hasPermission("content", "delete") && <button>Delete Content</button>}
    </div>
  )
}

