import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const DeleteUserFormSaga: React.FC = () => {
  const [id, setId] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'users/deleteUserSaga', payload: parseInt(id) });
    setId('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Delete User (Saga)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="User ID"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-red-500 text-white rounded">
          Delete User
        </button>
      </form>
    </div>
  );
};

export default DeleteUserFormSaga;

