import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import StudentList from './components/StudentList';
import TeacherList from './components/TeacherList';
import CourseList from './components/CourseList';
import GradeList from './components/GradeList';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">School Management System</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StudentList />
          <TeacherList />
          <CourseList />
          <GradeList />
        </div>
      </div>
    </Provider>
  );
};

export default App;

