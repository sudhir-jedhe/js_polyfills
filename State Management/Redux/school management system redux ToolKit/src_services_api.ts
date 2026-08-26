import { Student, Teacher, Course, Grade } from '../types';

// Mock data
let students: Student[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', dateOfBirth: '2000-01-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', dateOfBirth: '2001-02-15' },
];

let teachers: Teacher[] = [
  { id: 1, name: 'Mr. Johnson', email: 'johnson@example.com', subject: 'Math' },
  { id: 2, name: 'Ms. Williams', email: 'williams@example.com', subject: 'English' },
];

let courses: Course[] = [
  { id: 1, name: 'Mathematics 101', teacherId: 1 },
  { id: 2, name: 'English Literature', teacherId: 2 },
];

let grades: Grade[] = [
  { id: 1, studentId: 1, courseId: 1, grade: 85 },
  { id: 2, studentId: 1, courseId: 2, grade: 92 },
  { id: 3, studentId: 2, courseId: 1, grade: 78 },
  { id: 4, studentId: 2, courseId: 2, grade: 88 },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getStudents: async (): Promise<Student[]> => {
    await delay(500);
    return students;
  },
  addStudent: async (student: Omit<Student, 'id'>): Promise<Student> => {
    await delay(500);
    const newStudent = { ...student, id: students.length + 1 };
    students.push(newStudent);
    return newStudent;
  },
  updateStudent: async (student: Student): Promise<Student> => {
    await delay(500);
    const index = students.findIndex(s => s.id === student.id);
    if (index !== -1) {
      students[index] = student;
      return student;
    }
    throw new Error('Student not found');
  },
  deleteStudent: async (id: number): Promise<void> => {
    await delay(500);
    students = students.filter(s => s.id !== id);
  },

  getTeachers: async (): Promise<Teacher[]> => {
    await delay(500);
    return teachers;
  },
  addTeacher: async (teacher: Omit<Teacher, 'id'>): Promise<Teacher> => {
    await delay(500);
    const newTeacher = { ...teacher, id: teachers.length + 1 };
    teachers.push(newTeacher);
    return newTeacher;
  },
  updateTeacher: async (teacher: Teacher): Promise<Teacher> => {
    await delay(500);
    const index = teachers.findIndex(t => t.id === teacher.id);
    if (index !== -1) {
      teachers[index] = teacher;
      return teacher;
    }
    throw new Error('Teacher not found');
  },
  deleteTeacher: async (id: number): Promise<void> => {
    await delay(500);
    teachers = teachers.filter(t => t.id !== id);
  },

  getCourses: async (): Promise<Course[]> => {
    await delay(500);
    return courses;
  },
  addCourse: async (course: Omit<Course, 'id'>): Promise<Course> => {
    await delay(500);
    const newCourse = { ...course, id: courses.length + 1 };
    courses.push(newCourse);
    return newCourse;
  },
  updateCourse: async (course: Course): Promise<Course> => {
    await delay(500);
    const index = courses.findIndex(c => c.id === course.id);
    if (index !== -1) {
      courses[index] = course;
      return course;
    }
    throw new Error('Course not found');
  },
  deleteCourse: async (id: number): Promise<void> => {
    await delay(500);
    courses = courses.filter(c => c.id !== id);
  },

  getGrades: async (): Promise<Grade[]> => {
    await delay(500);
    return grades;
  },
  addGrade: async (grade: Omit<Grade, 'id'>): Promise<Grade> => {
    await delay(500);
    const newGrade = { ...grade, id: grades.length + 1 };
    grades.push(newGrade);
    return newGrade;
  },
  updateGrade: async (grade: Grade): Promise<Grade> => {
    await delay(500);
    const index = grades.findIndex(g => g.id === grade.id);
    if (index !== -1) {
      grades[index] = grade;
      return grade;
    }
    throw new Error('Grade not found');
  },
  deleteGrade: async (id: number): Promise<void> => {
    await delay(500);
    grades = grades.filter(g => g.id !== id);
  },
};

