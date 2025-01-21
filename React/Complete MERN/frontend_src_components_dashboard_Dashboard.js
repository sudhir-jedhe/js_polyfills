import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchUserData } from "../../slices/userSlice"
import DashboardStats from "./DashboardStats"

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchUserData())
  }, [dispatch])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {user && (
        <div>
          <p className="mb-4">Welcome, {user.username}!</p>
          <DashboardStats />
        </div>
      )}
    </div>
  )
}

export default Dashboard

