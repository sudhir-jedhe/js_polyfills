import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  experienceLevel: string;
}

const JobSearch: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs', {
        params: { search, location, category, type, experienceLevel }
      });
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Search jobs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="IT">IT</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          {/* Add more categories as needed */}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
        <select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">All Experience Levels</option>
          <option value="Entry">Entry</option>
          <option value="Mid-Level">Mid-Level</option>
          <option value="Senior">Senior</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Search
        </button>
      </form>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p>{job.company} - {job.location}</p>
            <p className="text-sm text-gray-500">{job.type} - {job.category} - {job.experienceLevel}</p>
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

