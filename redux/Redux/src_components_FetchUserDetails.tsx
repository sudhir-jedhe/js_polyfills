import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserDetailsThunk } from '../store/userSlice';
import { fetchUserDetailsStart } from '../store/userSagaSlice';
import { AppDispatch } from '../store';

const FetchUserDetails: React.FC = () => {
  const [userId, setUserId] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmitThunk = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchUserDetailsThunk(parseInt(userId)));
  };

  const handleSubmitSaga = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchUserDetailsStart(parseInt(userId)));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Fetch User Details</h2>
      <form onSubmit={handleSubmitThunk} className="space-y-4 mb-4">
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Fetch User Details (Thunk)
        </button>
      </form>
      <form onSubmit={handleSubmitSaga} className="space-y-4">
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
          Fetch User Details (Saga)
        </button>
      </form>
    </div>
  );
};

export default FetchUserDetails;

