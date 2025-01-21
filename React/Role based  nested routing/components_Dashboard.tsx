import React from "react"
import { Outlet, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export function Dashboard() {
  const { permissions, logout } = useAuth()

  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Home</Link>
          </li>
          <li>
            <Link to="/dashboard/users">Users</Link>
          </li>
          <li>
            <Link to="/dashboard/content">Content</Link>
          </li>
          <li>
            <Link to="/dashboard/reports">Reports</Link>
          </li>
          <li>
            <Link to="/dashboard/settings">Settings</Link>
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
      <div>
        <Outlet />
      </div>
    </div>
  )
}

