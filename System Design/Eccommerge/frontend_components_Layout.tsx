import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

const Layout: React.FC = ({ children }) => {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-bold">AmazonClone</a>
          </Link>
          <div>
            <Link href="/cart">
              <a className="mr-4">Cart</a>
            </Link>
            {isAuthenticated ? (
              <button onClick={logout} className="text-white">Logout</button>
            ) : (
              <Link href="/login">
                <a>Login</a>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          &copy; 2023 AmazonClone. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Layout

