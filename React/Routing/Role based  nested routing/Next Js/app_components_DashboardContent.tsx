"use client"

import Link from "next/link"
import { useAuth } from "../contexts/AuthContext"

export function DashboardContent() {
  const { permissions, logout, error, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading dashboard...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link href="/dashboard">Home</Link>
          </li>
          <li>
            <Link href="/dashboard/users">Users</Link>
          </li>
          <li>
            <Link href="/dashboard/content">Content</Link>
          </li>
          <li>
            <Link href="/dashboard/reports">Reports</Link>
          </li>
          <li>
            <Link href="/dashboard/settings">Settings</Link>
          </li>
        </ul>
      </nav>
      <button onClick={logout}>Logout</button>
      <div>
        <h2>Current Permissions:</h2>
        {Object.entries(permissions).map(([section, perms]) => (
          <div key={section}>
            <h3>{section}</h3>
            <ul>
              {Object.entries(perms).map(([action, value]) => (
                <li key={`${section}-${action}`}>
                  {action}: {value ? "Yes" : "No"}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

