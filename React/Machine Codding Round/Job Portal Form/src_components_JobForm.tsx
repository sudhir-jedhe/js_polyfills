import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface Job {
  id: number
  title: string
  company: string
  description: string
  postedBy: number
}

const JobForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState<Job>({
    id: 0,
    title: "",
    company: "",
    description: "",
    postedBy: user?.id || 0,
  })

  useEffect(() => {
    if (id) {
      // Simulating API call to fetch job details
      const fetchJob = async () => {
        // In a real application, this would be an API call
        const mockJob: Job = {
          id: Number.parseInt(id),
          title: "Software Engineer",
          company: "Tech Co",
          description: "Exciting role for a software engineer",
          postedBy: 2,
        }
        setJob(mockJob)
      }

      fetchJob()
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setJob((prevJob) => ({ ...prevJob, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would be an API call to create or update the job
    console.log("Job submitted:", job)
    navigate("/jobs")
  }

  return (
    <div className="job-form">
      <h1>{id ? "Edit Job" : "Create New Job"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={job.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="company">Company:</label>
          <input type="text" id="company" name="company" value={job.company} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={job.description} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-submit">
          {id ? "Update Job" : "Create Job"}
        </button>
      </form>
    </div>
  )
}

export default JobForm

