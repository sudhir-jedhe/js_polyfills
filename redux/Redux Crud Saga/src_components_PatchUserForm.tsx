import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { patchUserThunk } from '../store/userSlice';
import { AppDispatch } from '../store';

const PatchUserForm: React.FC = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(patchUserThunk({ id: parseInt(id), partialUser: { name } }));
    setId('');
    setName('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Patch User (Thunk)</h2>
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
        <button type="submit" className="w-full p-2 bg-purple-500 text-white rounded">
          Patch User
        </button>
      </form>
    </div>
  );
};

export default PatchUserForm;

