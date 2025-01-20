import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserThunk } from '../store/userSlice';
import { AppDispatch } from '../store';
import { User } from '../types/User';

const UpdateUserForm: React.FC = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = { id: parseInt(id), name, email };
    dispatch(updateUserThunk(user));
    setId('');
    setName('');
    setEmail('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Update User (Thunk)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="User ID"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="New Email"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-yellow-500 text-white rounded">
          Update User
        </button>
      </form>
    </div>
  );
};

export default UpdateUserForm;

