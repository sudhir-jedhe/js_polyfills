import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchCourses, addCourse, updateCourse, deleteCourse } from '../store/coursesSlice';
import { fetchTeachers } from '../store/teachersSlice';
import { Course } from '../types';

const CourseList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, status, error } = useSelector((state: RootState) => state.courses);
  const { teachers } = useSelector((state: RootState) => state.teachers);
  const [newCourse, setNewCourse] = useState({ name: '', teacherId: 0 });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCourses());
    }
    dispatch(fetchTeachers());
  }, [status, dispatch]);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addCourse(newCourse));
    setNewCourse({ name: '', teacherId: 0 });
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      dispatch(updateCourse(editingCourse));
      setEditingCourse(null);
    }
  };

  const handleDeleteCourse = (id: number) => {
    dispatch(deleteCourse(id));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Courses</h2>
      <form onSubmit={handleAddCourse} className="mb-4">
        <input
          type="text"
          placeholder="Course Name"
          value={newCourse.name}
          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={newCourse.teacherId}
          onChange={(e) => setNewCourse({ ...newCourse, teacherId: Number(e.target.value) })}
          className="border p-2 mr-2"
        >
          <option value={0}>Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Course</button>
      </form>
      <ul>
        {courses.map((course) => (
          <li key={course.id} className="mb-2">
            {editingCourse && editingCourse.id === course.id ? (
              <form onSubmit={handleUpdateCourse} className="flex items-center">
                <input
                  type="text"
                  value={editingCourse.name}
                  onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                  className="border p-2 mr-2"
                />
                <select
                  value={editingCourse.teacherId}
                  onChange={(e) => setEditingCourse({ ...editingCourse, teacherId: Number(e.target.value) })}
                  className="border p-2 mr-2"
                >
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
                <button type="submit" className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
                <button onClick={() => setEditingCourse(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
              </form>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">{course.name}</span>
                <span className="mr-2">Teacher: {teachers.find(t => t.id === course.teacherId)?.name}</span>
                <button onClick={() => setEditingCourse(course)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
                <button onClick={() => handleDeleteCourse(course.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
