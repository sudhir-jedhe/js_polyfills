import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to JobSearch</h1>
      <p className="text-xl mb-8">Find your dream job or hire the perfect candidate</p>
      <div className="space-x-4">
        <Link to="/jobs" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Search Jobs
        </Link>
        <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Home;

