import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const HomePage = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to RBAC App</h1>
      {isAuthenticated ? (
        <div>
          <p className="mb-4">Hello, {user.username}!</p>
          <Link to="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div>
          <p className="mb-4">Please log in or register to access the dashboard.</p>
          <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
            Login
          </Link>
          <Link to="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Register
          </Link>
        </div>
      )}
    </div>
  )
}

export default HomePage

