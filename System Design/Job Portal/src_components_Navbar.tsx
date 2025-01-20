import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">JobSearch</Link>
        <div className="space-x-4">
          <Link to="/jobs" className="hover:underline">Jobs</Link>
          <Link to="/companies" className="hover:underline">Companies</Link>
          {user ? (
            <>
              {user.role === 'jobseeker' && (
                <>
                  <Link to="/profile" className="hover:underline">Profile</Link>
                  <Link to="/saved-jobs" className="hover:underline">Saved Jobs</Link>
                </>
              )}
              {(user.role === 'employer' || user.role === 'recruiter') && (
                <>
                  <Link to="/company-profile" className="hover:underline">Company Profile</Link>
                  <Link to="/post-job" className="hover:underline">Post Job</Link>
                  <Link to="/manage-jobs" className="hover:underline">Manage Jobs</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin-dashboard" className="hover:underline">Admin Dashboard</Link>
              )}
              <button onClick={logout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

