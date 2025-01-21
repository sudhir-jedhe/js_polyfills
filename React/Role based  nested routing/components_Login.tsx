import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface Permission {
  view: boolean
  edit: boolean
  create: boolean
  delete: boolean
}

interface Permissions {
  users: Permission
  content: Permission
  reports: Permission
  settings: Permission
}

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [permissions, setPermissions] = useState<Permissions>({
    users: { view: false, edit: false, create: false, delete: false },
    content: { view: false, edit: false, create: false, delete: false },
    reports: { view: false, edit: false, create: false, delete: false },
    settings: { view: false, edit: false, create: false, delete: false },
  })

  const from = location.state?.from?.pathname || "/dashboard"

  const handlePermissionChange = (section: keyof Permissions, action: keyof Permission) => {
    setPermissions((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [action]: !prev[section][action],
      },
    }))
  }

  const handleLogin = () => {
    login(permissions)
    navigate(from, { replace: true })
  }

  const renderPermissionButtons = (section: keyof Permissions) => {
    return (
      <div>
        <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
        {Object.entries(permissions[section]).map(([action, value]) => (
          <button
            key={`${section}-${action}`}
            onClick={() => handlePermissionChange(section, action as keyof Permission)}
            style={{ backgroundColor: value ? "green" : "red" }}
          >
            {action}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div>
      <h1>Login</h1>
      <div>
        {Object.keys(permissions).map((section) => (
          <React.Fragment key={section}>{renderPermissionButtons(section as keyof Permissions)}</React.Fragment>
        ))}
      </div>
      <button onClick={handleLogin}>Login with Selected Permissions</button>
    </div>
  )
}

