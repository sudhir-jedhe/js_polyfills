export interface Student {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
}

export interface Course {
  id: number;
  name: string;
  teacherId: number;
}

export interface Grade {
  id: number;
  studentId: number;
  courseId: number;
  grade: number;
}

