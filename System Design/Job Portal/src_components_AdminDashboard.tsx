import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  isApproved: boolean;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, jobsRes] = await Promise.all([
          axios.get('/api/admin/users'),
          axios.get('/api/admin/jobs/pending')
        ]);
        setUsers(usersRes.data);
        setPendingJobs(jobsRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVerifyUser = async (userId: string) => {
    try {
      await axios.put(`/api/admin/users/${userId}/verify`);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isVerified: true } : user
      ));
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const handleApproveJob = async (jobId: string) => {
    try {
      await axios.put(`/api/admin/jobs/${jobId}/approve`);
      setPendingJobs(pendingJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Email</th>
              <th className="text-left">Role</th>
              <th className="text-left">Verified</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isVerified ? 'Yes' : 'No'}</td>
                <td>
                  {!user.isVerified && (
                    <button
                      onClick={() => handleVerifyUser(user._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Pending Jobs</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Title</th>
              <th className="text-left">Company</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingJobs.map(job => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>
                  <button
                    onClick={() => handleApproveJob(job._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

