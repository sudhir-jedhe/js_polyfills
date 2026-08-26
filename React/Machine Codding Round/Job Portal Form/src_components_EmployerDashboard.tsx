import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { BarChart, DoughnutChart } from "./charts/ChartComponents"

interface Job {
  id: number
  title: string
  company: string
  postedBy: number
}

interface Application {
  jobId: number
  userId: number
}

const EmployerDashboard: React.FC = () => {
  const { user } = useAuth()
  const [postedJobs, setPostedJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    if (user) {
      // Fetch posted jobs
      const allJobs: Job[] = JSON.parse(localStorage.getItem("jobs") || "[]")
      const employerJobs = allJobs.filter((job) => job.postedBy === user.id)
      setPostedJobs(employerJobs)

      // Fetch applications for posted jobs
      const allApplications: Application[] = JSON.parse(localStorage.getItem("applications") || "[]")
      const jobApplications = allApplications.filter((app) => employerJobs.some((job) => job.id === app.jobId))
      setApplications(jobApplications)
    }
  }, [user])

  const applicationsByJobData = {
    labels: postedJobs.map((job) => job.title),
    datasets: [
      {
        label: "Applications per Job",
        data: postedJobs.map((job) => applications.filter((app) => app.jobId === job.id).length),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  }

  const jobDistributionData = {
    labels: postedJobs.map((job) => job.title),
    datasets: [
      {
        label: "Job Distribution",
        data: postedJobs.map(() => 1),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  }

  return (
    <div className="employer-dashboard">
      <h1>Employer Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Applications per Job</h2>
          <BarChart data={applicationsByJobData} title="Applications per Job" />
        </div>
        <div className="dashboard-section">
          <h2>Job Distribution</h2>
          <DoughnutChart data={jobDistributionData} title="Job Distribution" />
        </div>
        <div className="dashboard-section">
          <h2>Your Posted Jobs</h2>
          <ul>
            {postedJobs.map((job) => (
              <li key={job.id}>
                {job.title} - {job.company}
                <span className="application-count">
                  Applications: {applications.filter((app) => app.jobId === job.id).length}
                </span>
              </li>
            ))}
          </ul>
          <Link to="/jobs/new" className="btn btn-primary">
            Post New Job
          </Link>
        </div>
        <div className="dashboard-section">
          <h2>Recent Applications</h2>
          <ul>
            {applications.slice(0, 5).map((app, index) => {
              const job = postedJobs.find((j) => j.id === app.jobId)
              return (
                <li key={index}>
                  {job ? job.title : "Unknown Job"} - Applicant ID: {app.userId}
                </li>
              )
            })}
          </ul>
          <Link to="/applications" className="btn btn-primary">
            View All Applications
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EmployerDashboard

