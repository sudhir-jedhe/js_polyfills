import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { PieChart, LineChart } from "./charts/ChartComponents"

interface Job {
  id: number
  title: string
  company: string
  createdAt: string
}

interface Application {
  jobId: number
  userId: number
  createdAt: string
}

const JobSeekerDashboard: React.FC = () => {
  const { user } = useAuth()
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    if (user) {
      // Fetch recent jobs
      const allJobs: Job[] = JSON.parse(localStorage.getItem("jobs") || "[]")
      setRecentJobs(allJobs.slice(-5).reverse())

      // Fetch applied jobs
      const allApplications: Application[] = JSON.parse(localStorage.getItem("applications") || "[]")
      const userApplications = allApplications.filter((app) => app.userId === user.id)
      setApplications(userApplications)
      const userAppliedJobs = allJobs.filter((job) => userApplications.some((app) => app.jobId === job.id))
      setAppliedJobs(userAppliedJobs)
    }
  }, [user])

  const appliedJobsData = {
    labels: ["Applied Jobs", "Other Jobs"],
    datasets: [
      {
        data: [appliedJobs.length, Math.max(recentJobs.length - appliedJobs.length, 0)],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  }

  const applicationsOverTimeData = {
    labels: applications.map((app) => new Date(app.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Applications Over Time",
        data: applications.map((_, index) => index + 1),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="jobseeker-dashboard">
      <h1>Job Seeker Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Applied vs Available Jobs</h2>
          <PieChart data={appliedJobsData} title="Applied vs Available Jobs" />
        </div>
        <div className="dashboard-section">
          <h2>Applications Over Time</h2>
          <LineChart data={applicationsOverTimeData} title="Applications Over Time" />
        </div>
        <div className="dashboard-section">
          <h2>Your Applications</h2>
          <ul>
            {appliedJobs.map((job) => (
              <li key={job.id}>
                {job.title} - {job.company}
              </li>
            ))}
          </ul>
          <Link to="/applications" className="btn btn-primary">
            View All Applications
          </Link>
        </div>
        <div className="dashboard-section">
          <h2>Recent Job Postings</h2>
          <ul>
            {recentJobs.map((job) => (
              <li key={job.id}>
                {job.title} - {job.company}
              </li>
            ))}
          </ul>
          <Link to="/jobs" className="btn btn-primary">
            View All Jobs
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobSeekerDashboard

