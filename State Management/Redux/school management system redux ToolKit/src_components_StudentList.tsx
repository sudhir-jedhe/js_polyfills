import React, { useCallback, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchStudents, addStudent, updateStudent, deleteStudent, selectStudentsByGrade } from '../store/studentsSlice';
import { Student } from '../types';
import { useEntityData } from '../hooks/useEntityData';
import { useForm } from '../hooks/useForm';

const StudentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { entities: students, status, error } = useEntityData(
    (state: RootState) => state.students,
    fetchStudents
  );

  const studentsWithGrades = useEntityData(selectStudentsByGrade, fetchStudents);

  const { formData: newStudent, handleChange: handleNewStudentChange, resetForm: resetNewStudentForm } = useForm({
    name: '',
    email: '',
    dateOfBirth: ''
  });

  const editingStudentRef = useRef<Student | null>(null);

  const handleAddStudent = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addStudent(newStudent));
    resetNewStudentForm();
  }, [dispatch, newStudent, resetNewStudentForm]);

  const handleUpdateStudent = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudentRef.current) {
      dispatch(updateStudent(editingStudentRef.current));
      editingStudentRef.current = null;
    }
  }, [dispatch]);

  const handleDeleteStudent = useCallback((id: number) => {
    dispatch(deleteStudent(id));
  }, [dispatch]);

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => a.name.localeCompare(b.name));
  }, [students]);

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
          name="name"
          placeholder="Name"
          value={newStudent.name}
          onChange={handleNewStudentChange}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newStudent.email}
          onChange={handleNewStudentChange}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          name="dateOfBirth"
          value={newStudent.dateOfBirth}
          onChange={handleNewStudentChange}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Student</button>
      </form>
      <ul>
        {sortedStudents.map((student) => (
          <li key={student.id} className="mb-2">
            {editingStudentRef.current && editingStudentRef.current.id === student.id ? (
              <form onSubmit={handleUpdateStudent} className="flex items-center">
                <input
                  type="text"
                  value={editingStudentRef.current.name}
                  onChange={(e) => editingStudentRef.current = { ...editingStudentRef.current!, name: e.target.value }}
                  className="border p-2 mr-2"
                />
                <input
                  type="email"
                  value={editingStudentRef.current.email}
                  onChange={(e) => editingStudentRef.current = { ...editingStudentRef.current!, email: e.target.value }}
                  className="border p-2 mr-2"
                />
                <input
                  type="date"
                  value={editingStudentRef.current.dateOfBirth}
                  onChange={(e) => editingStudentRef.current = { ...editingStudentRef.current!, dateOfBirth: e.target.value }}
                  className="border p-2 mr-2"
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
                <button onClick={() => editingStudentRef.current = null} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
              </form>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">{student.name}</span>
                <span className="mr-2">{student.email}</span>
                <span className="mr-2">{student.dateOfBirth}</span>
                <span className="mr-2">Average Grade: {studentsWithGrades.entities.find(s => s.id === student.id)?.averageGrade?.toFixed(2) || 'N/A'}</span>
                <button onClick={() => editingStudentRef.current = student} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
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

