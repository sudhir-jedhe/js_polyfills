import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Dashboard } from "./components/Dashboard"
import { Users } from "./components/Users"
import { Content } from "./components/Content"
import { Reports } from "./components/Reports"
import { Settings } from "./components/Settings"
import { Login } from "./components/Login"

const Unauthorized = () => <div>Unauthorized Access</div>

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<div>Welcome to the Dashboard</div>} />

            <Route
              path="users"
              element={
                <ProtectedRoute requiredPermission={{ section: "users", action: "view" }}>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="content"
              element={
                <ProtectedRoute requiredPermission={{ section: "content", action: "view" }}>
                  <Content />
                </ProtectedRoute>
              }
            />

            <Route
              path="reports"
              element={
                <ProtectedRoute requiredPermission={{ section: "reports", action: "view" }}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            <Route
              path="settings"
              element={
                <ProtectedRoute requiredPermission={{ section: "settings", action: "view" }}>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

