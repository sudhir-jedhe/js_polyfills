import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

const Layout: React.FC = ({ children }) => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-bold">MovieBooker</a>
          </Link>
          <div className="space-x-4">
            <Link href="/movies">
              <a>Movies</a>
            </Link>
            {user ? (
              <>
                <Link href="/profile">
                  <a>Profile</a>
                </Link>
                <button onClick={logout} className="text-white">Logout</button>
              </>
            ) : (
              <Link href="/login">
                <a>Login</a>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-200 py-4">
        <div className="container mx-auto px-4 text-center">
          &copy; 2023 MovieBooker. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Layout

