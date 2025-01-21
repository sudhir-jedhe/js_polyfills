import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem("token")
    }
    return Promise.reject(error)
  },
)

// Fetch API wrapper
const fetchWrapper = async (url, options = {}) => {
  const token = localStorage.getItem("token")
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const response = await fetch(`${API_URL}${url}`, options)

  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem("token")
    }
    const error = await response.json()
    throw new Error(error.message || "Something went wrong")
  }

  return response.json()
}

// API methods using Axios
export const axiosApi = {
  get: (url) => axiosInstance.get(url),
  post: (url, data) => axiosInstance.post(url, data),
  put: (url, data) => axiosInstance.put(url, data),
  delete: (url) => axiosInstance.delete(url),
}

// API methods using Fetch
export const fetchApi = {
  get: (url) => fetchWrapper(url),
  post: (url, data) =>
    fetchWrapper(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  put: (url, data) =>
    fetchWrapper(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (url) => fetchWrapper(url, { method: "DELETE" }),
}

// Default export using Axios
export default axiosApi

