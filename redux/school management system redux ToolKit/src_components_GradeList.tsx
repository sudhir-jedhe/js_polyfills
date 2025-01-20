import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchGrades, addGrade, updateGrade, deleteGrade } from '../store/gradesSlice';
import { fetchStudents } from '../store/studentsSlice';
import { fetchCourses } from '../store/coursesSlice';
import { Grade } from '../types';

const GradeList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { grades, status, error } = useSelector((state: RootState) => state.grades);
  const { students } = useSelector((state: RootState) => state.students);
  const { courses } = useSelector((state: RootState) => state.courses);
  const [newGrade, setNewGrade] = useState({ studentId: 0, courseId: 0, grade: 0 });
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGrades());
    }
    dispatch(fetchStudents());
    dispatch(fetchCourses());
  }, [status, dispatch]);

  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addGrade(newGrade));
    setNewGrade({ studentId: 0, courseId: 0, grade: 0 });
  };

  const handleUpdateGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGrade) {
      dispatch(updateGrade(editingGrade));
      setEditingGrade(null);
    }
  };

  const handleDeleteGrade = (id: number) => {
    dispatch(deleteGrade(id));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Grades</h2>
      <form onSubmit={handleAddGrade} className="mb-4">
        <select
          value={newGrade.studentId}
          onChange={(e) => setNewGrade({ ...newGrade, studentId: Number(e.target.value) })}
          className="border p-2 mr-2"
        >
          <option value={0}>Select Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>{student.name}</option>
          ))}
        </select>
        <select
          value={newGrade.courseId}
          onChange={(e) => setNewGrade({ ...newGrade, courseId: Number(e.target.value) })}
          className="border p-2 mr-2"
        >
          <option value={0}>Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Grade"
          value={newGrade.grade}
          onChange={(e) => setNewGrade({ ...newGrade, grade: Number(e.target.value) })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Grade</button>
      </form>
      <ul>
        {grades.map((grade) => (
          <li key={grade.id} className="mb-2">
            {editingGrade && editingGrade.id === grade.id ? (
              <form onSubmit={handleUpdateGrade} className="flex items-center">
                <select
                  value={editingGrade.studentId}
                  onChange={(e) => setEditingGrade({ ...editingGrade, studentId: Number(e.target.value) })}
                  className="border p-2 mr-2"
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
                <select
                  value={editingGrade.courseId}
                  onChange={(e) => setEditingGrade({ ...editingGrade, courseId: Number(e.target.value) })}
                  className="border p-2 mr-2"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={editingGrade.grade}
                  onChange={(e) => setEditingGrade({ ...editingGrade, grade: Number(e.target.value) })}
                  className="border p-2 mr-2"
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
                <button onClick={() => setEditingGrade(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
              </form>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">Student: {students.find(s => s.id === grade.studentId)?.name}</span>
                <span className="mr-2">Course: {courses.find(c => c.id === grade.courseId)?.name}</span>
                <span className="mr-2">Grade: {grade.grade}</span>
                <button onClick={() => setEditingGrade(grade)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
                <button onClick={() => handleDeleteGrade(grade.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GradeList;

