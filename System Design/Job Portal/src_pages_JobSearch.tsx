import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
}

const JobSearch: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/jobs');
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p>{job.company} - {job.location}</p>
            <p className="text-sm text-gray-500">{job.type}</p>
            <Link to={`/jobs/${job._id}`} className="text-blue-500 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSearch;

