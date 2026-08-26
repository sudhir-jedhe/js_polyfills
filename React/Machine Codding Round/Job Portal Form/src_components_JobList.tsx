import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface Job {
  id: number
  title: string
  company: string
  description: string
  postedBy: number
}

interface Application {
  jobId: number
  userId: number
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // Simulating API call to fetch jobs
    const fetchJobs = async () => {
      const storedJobs = localStorage.getItem("jobs")
      if (storedJobs) {
        setJobs(JSON.parse(storedJobs))
      } else {
        const mockJobs: Job[] = [
          {
            id: 1,
            title: "Software Engineer",
            company: "Tech Co",
            description: "Exciting role for a software engineer",
            postedBy: 2,
          },
          { id: 2, title: "Data Analyst", company: "Data Inc", description: "Looking for a data analyst", postedBy: 2 },
          {
            id: 3,
            title: "Product Manager",
            company: "Product Co",
            description: "Experienced product manager needed",
            postedBy: 2,
          },
        ]
        setJobs(mockJobs)
        localStorage.setItem("jobs", JSON.stringify(mockJobs))
      }
    }

    const fetchApplications = async () => {
      const storedApplications = localStorage.getItem("applications")
      if (storedApplications) {
        setApplications(JSON.parse(storedApplications))
      }
    }

    fetchJobs()
    fetchApplications()
  }, [])

  const handleDelete = (id: number) => {
    const updatedJobs = jobs.filter((job) => job.id !== id)
    setJobs(updatedJobs)
    localStorage.setItem("jobs", JSON.stringify(updatedJobs))
  }

  const handleApply = (jobId: number) => {
    if (user) {
      const newApplication: Application = { jobId, userId: user.id }
      const updatedApplications = [...applications, newApplication]
      setApplications(updatedApplications)
      localStorage.setItem("applications", JSON.stringify(updatedApplications))
    }
  }

  const hasApplied = (jobId: number) => {
    return applications.some((app) => app.jobId === jobId && app.userId === user?.id)
  }

  return (
    <div className="job-list">
      <h1>Job Listings</h1>
      {jobs.map((job) => (
        <div key={job.id} className="job-item">
          <h2>{job.title}</h2>
          <p>{job.company}</p>
          <p>{job.description}</p>
          {(user?.role === "admin" || (user?.role === "employer" && job.postedBy === user.id)) && (
            <div className="job-actions">
              <Link to={`/jobs/${job.id}`} className="btn btn-edit">
                Edit
              </Link>
              <button onClick={() => handleDelete(job.id)} className="btn btn-delete">
                Delete
              </button>
            </div>
          )}
          {user?.role === "jobseeker" && (
            <button onClick={() => handleApply(job.id)} className="btn btn-apply" disabled={hasApplied(job.id)}>
              {hasApplied(job.id) ? "Applied" : "Apply"}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default JobList

