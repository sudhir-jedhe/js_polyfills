import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchStudents, addStudent, updateStudent, deleteStudent } from '../store/studentsSlice';
import { Student } from '../types';

const StudentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, status, error } = useSelector((state: RootState) => state.students);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', dateOfBirth: '' });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchStudents());
    }
  }, [status, dispatch]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addStudent(newStudent));
    setNewStudent({ name: '', email: '', dateOfBirth: '' });
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      dispatch(updateStudent(editingStudent));
      setEditingStudent(null);
    }
  };

  const handleDeleteStudent = (id: number) => {
    dispatch(deleteStudent(id));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <form onSubmit={handleAddStudent} className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newStudent.email}
          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          value={newStudent.dateOfBirth}
          onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Student</button>
      </form>
      <ul>
        {students.map((student) => (
          <li key={student.id} className="mb-2">
            {editingStudent && editingStudent.id === student.id ? (
              <form onSubmit={handleUpdateStudent} className="flex items-center">
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="border p-2 mr-2"
                />
                <input
                  type="email"
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="border p-2 mr-2"
                />
                <input
                  type="date"
                  value={editingStudent.dateOfBirth}
                  onChange={(e) => setEditingStudent({ ...editingStudent, dateOfBirth: e.target.value })}
                  className="border p-2 mr-2"
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
                <button onClick={() => setEditingStudent(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
              </form>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">{student.name}</span>
                <span className="mr-2">{student.email}</span>
                <span className="mr-2">{student.dateOfBirth}</span>
                <button onClick={() => setEditingStudent(student)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
                <button onClick={() => handleDeleteStudent(student.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;

