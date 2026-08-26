import React from "react"
import { useAuth } from "../contexts/AuthContext"

export function Reports() {
  const { hasPermission } = useAuth()

  return (
    <div>
      <h2>Reports</h2>
      {hasPermission("reports", "view") && <p>Reports list goes here</p>}
      {hasPermission("reports", "create") && <button>Generate Report</button>}
      {hasPermission("reports", "edit") && <button>Edit Report</button>}
      {hasPermission("reports", "delete") && <button>Delete Report</button>}
    </div>
  )
}

