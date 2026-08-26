import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserDetailsThunk } from '../store/userSlice';
import { AppDispatch } from '../store';

const FetchUserDetails: React.FC = () => {
  const [userId, setUserId] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchUserDetailsThunk(parseInt(userId)));
    setUserId('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Fetch User Details (Complex Thunk)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Fetch User Details
        </button>
      </form>
    </div>
  );
};

export default FetchUserDetails;

