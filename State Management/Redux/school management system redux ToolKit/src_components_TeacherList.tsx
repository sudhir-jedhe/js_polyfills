import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTeachers, addTeacher, updateTeacher, deleteTeacher } from '../store/teachersSlice';
import { Teacher } from '../types';

const TeacherList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teachers, status, error } = useSelector((state: RootState) => state.teachers);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', subject: '' });
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTeachers());
    }
  }, [status, dispatch]);

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addTeacher(newTeacher));
    setNewTeacher({ name: '', email: '', subject: '' });
  };

  const handleUpdateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      dispatch(updateTeacher(editingTeacher));
      setEditingTeacher(null);
    }
  };

  const handleDeleteTeacher = (id: number) => {
    dispatch(deleteTeacher(id));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Teachers</h2>
      <form onSubmit={handleAddTeacher} className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newTeacher.name}
          onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newTeacher.email}
          onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Subject"
          value={newTeacher.subject}
          onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Teacher</button>
      </form>
      <ul>
        {teachers.map((teacher) => (
          <li key={teacher.id} className="mb-2">
            {editingTeacher && editingTeacher.id === teacher.id ? (
              <form onSubmit={handleUpdateTeacher} className="flex items-center">
                <input
                  type="text"
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  className="border p-2 mr-2"
                />
                <input
                  type="email"
                  value={editingTeacher.email}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                  className="border p-2 mr-2"
                />
                <input
                  type="text"
                  value={editingTeacher.subject}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                  className="border p-2 mr-2"
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
                <button onClick={() => setEditingTeacher(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
              </form>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">{teacher.name}</span>
                <span className="mr-2">{teacher.email}</span>
                <span className="mr-2">{teacher.subject}</span>
                <button onClick={() => setEditingTeacher(teacher)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
                <button onClick={() => handleDeleteTeacher(teacher.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherList;

