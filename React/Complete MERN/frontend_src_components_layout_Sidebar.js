import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { FaBars, FaTimes, FaHome, FaUser, FaCog } from "react-icons/fa"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      <button className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-6">RBAC App</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaHome className="mr-2" /> Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaUser className="mr-2" /> Dashboard
              </Link>
            </li>
            {user && user.roles.includes("admin") && (
              <li>
                <Link to="/users" className="flex items-center p-2 hover:bg-gray-700 rounded">
                  <FaCog className="mr-2" /> User Management
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Sidebar

