import React from "react"
import UserList from "../components/users/UserList"

const UsersPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <UserList />
    </div>
  )
}

export default UsersPage

