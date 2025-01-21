import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { PieChart, BarChart, LineChart, DoughnutChart } from "./charts/ChartComponents"

interface User {
  id: number
  username: string
  role: string
}

interface Job {
  id: number
  title: string
  company: string
  createdAt: string
}

const AdminDashboard: React.FC = () => {
  const [userCount, setUserCount] = useState<Record<string, number>>({})
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [jobsOverTime, setJobsOverTime] = useState<Record<string, number>>({})

  useEffect(() => {
    // Fetch user counts
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    const counts = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    setUserCount(counts)

    // Fetch recent users
    setRecentUsers(users.slice(-5).reverse())

    // Fetch recent jobs
    const jobs: Job[] = JSON.parse(localStorage.getItem("jobs") || "[]")
    setRecentJobs(jobs.slice(-5).reverse())

    // Calculate jobs over time
    const jobsByDate = jobs.reduce(
      (acc, job) => {
        const date = new Date(job.createdAt).toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    setJobsOverTime(jobsByDate)
  }, [])

  const userRoleData = {
    labels: Object.keys(userCount),
    datasets: [
      {
        label: "User Roles",
        data: Object.values(userCount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  }

  const jobsOverTimeData = {
    labels: Object.keys(jobsOverTime),
    datasets: [
      {
        label: "Jobs Posted",
        data: Object.values(jobsOverTime),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>User Statistics</h2>
          <PieChart data={userRoleData} title="User Roles Distribution" />
        </div>
        <div className="dashboard-section">
          <h2>Jobs Over Time</h2>
          <LineChart data={jobsOverTimeData} title="Jobs Posted Over Time" />
        </div>
        <div className="dashboard-section">
          <h2>Recent Users</h2>
          <ul>
            {recentUsers.map((user) => (
              <li key={user.id}>
                {user.username} - {user.role}
              </li>
            ))}
          </ul>
          <Link to="/users" className="btn btn-primary">
            Manage Users
          </Link>
        </div>
        <div className="dashboard-section">
          <h2>Recent Jobs</h2>
          <ul>
            {recentJobs.map((job) => (
              <li key={job.id}>
                {job.title} - {job.company}
              </li>
            ))}
          </ul>
          <Link to="/jobs" className="btn btn-primary">
            Manage Jobs
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

