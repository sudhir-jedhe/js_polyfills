import type React from "react"
import { useState, useEffect } from "react"

interface User {
  id: number
  username: string
  role: string
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    // Simulating API call to fetch users
    const fetchUsers = async () => {
      // In a real application, this would be an API call
      const mockUsers: User[] = [
        { id: 1, username: "admin", role: "admin" },
        { id: 2, username: "employer", role: "employer" },
        { id: 3, username: "jobseeker", role: "jobseeker" },
      ]
      setUsers(mockUsers)
    }

    fetchUsers()
  }, [])

  return (
    <div className="user-list">
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-edit">Edit</button>
                <button className="btn btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList

