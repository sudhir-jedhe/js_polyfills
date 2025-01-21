import type React from "react"
import { useAuth } from "../contexts/AuthContext"
import AdminDashboard from "./AdminDashboard"
import EmployerDashboard from "./EmployerDashboard"
import JobSeekerDashboard from "./JobSeekerDashboard"

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  switch (user.role) {
    case "admin":
      return <AdminDashboard />
    case "employer":
      return <EmployerDashboard />
    case "jobseeker":
      return <JobSeekerDashboard />
    default:
      return <div>Invalid user role</div>
  }
}

export default Dashboard

