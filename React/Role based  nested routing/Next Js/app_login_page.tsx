"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { loginSchema, type LoginInput } from "../lib/validation"

export default function Login() {
  const { login, error, isLoading } = useAuth()
  const [formData, setFormData] = useState<LoginInput>({
    username: "",
    password: "",
    csrfToken: "",
    twoFactorToken: "",
  })
  const [validationErrors, setValidationErrors] = useState<Partial<LoginInput>>({})

  useEffect(() => {
    // Fetch CSRF token when component mounts
    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setFormData((prev) => ({ ...prev, csrfToken: data.csrfToken })))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      loginSchema.parse(formData)
      setValidationErrors({})
      await login(formData.username, formData.password, formData.csrfToken, formData.twoFactorToken)
    } catch (error) {
      if (error instanceof Error) {
        setValidationErrors(JSON.parse(error.message))
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="csrfToken" value={formData.csrfToken} />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {validationErrors.username && <p className="text-red-500 text-xs mt-1">{validationErrors.username}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {validationErrors.password && <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}

