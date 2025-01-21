import React from "react"
import { useSelector } from "react-redux"

const DashboardStats = () => {
  const { user } = useSelector((state) => state.user)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Total Logins</h2>
        <p className="text-3xl font-bold">{user.totalLogins || 0}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Last Login</h2>
        <p className="text-3xl font-bold">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Role</h2>
        <p className="text-3xl font-bold">{user.roles.join(", ")}</p>
      </div>
    </div>
  )
}

export default DashboardStats

