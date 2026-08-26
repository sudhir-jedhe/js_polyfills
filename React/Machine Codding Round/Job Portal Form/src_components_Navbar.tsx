import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Job Portal
      </Link>
      {user ? (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
          {(user.role === "admin" || user.role === "employer") && (
            <li className="nav-item">
              <Link to="/jobs/new" className="nav-link">
                Post Job
              </Link>
            </li>
          )}
          {user.role === "admin" && (
            <li className="nav-item">
              <Link to="/users" className="nav-link">
                Users
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <button onClick={logout} className="nav-link btn-link">
              Logout
            </button>
          </li>
        </ul>
      ) : (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </li>
        </ul>
      )}
    </nav>
  )
}

export default Navbar

