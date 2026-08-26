import type React from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import Navbar from "./components/Navbar"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import JobList from "./components/JobList"
import JobForm from "./components/JobForm"
import UserList from "./components/UserList"
import Profile from "./components/Profile"
import "./styles/App.css"

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
              <Route path="/jobs" element={<PrivateRoute element={<JobList />} />} />
              <Route path="/jobs/new" element={<PrivateRoute element={<JobForm />} roles={['admin', 'employer']} />} />
              <Route path="/jobs/:id" element={<Privateemployer']} />} />
              <Route path="/jobs/:id" element={<PrivateRoute element={<JobForm />} roles={['admin', 'employer']} />} />
              <Route path="/users" element={<PrivateRoute element={<UserList />} roles={['admin']} />} />
              <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

