import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { Student } from '../types';
import { api } from '../services/api';
import { RootState } from './index';

interface StudentsState {
  students: Student[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  status: 'idle',
  error: null,
};

export const fetchStudents = createAsyncThunk('students/fetchStudents', async () => {
  return await api.getStudents();
});

export const addStudent = createAsyncThunk('students/addStudent', async (student: Omit<Student, 'id'>) => {
  return await api.addStudent(student);
});

export const updateStudent = createAsyncThunk('students/updateStudent', async (student: Student) => {
  return await api.updateStudent(student);
});

export const deleteStudent = createAsyncThunk('students/deleteStudent', async (id: number) => {
  await api.deleteStudent(id);
  return id;
});

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch students';
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(student => student.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(student => student.id !== action.payload);
      });
  },
});

export default studentsSlice.reducer;

export const selectStudentsByGrade = createSelector(
  (state: RootState) => state.students.students,
  (state: RootState) => state.grades.grades,
  (students, grades) => {
    const studentGrades = new Map<number, number[]>();
    grades.forEach(grade => {
      if (!studentGrades.has(grade.studentId)) {
        studentGrades.set(grade.studentId, []);
      }
      studentGrades.get(grade.studentId)!.push(grade.grade);
    });

    return students.map(student => ({
      ...student,
      averageGrade: studentGrades.has(student.id)
        ? studentGrades.get(student.id)!.reduce((a, b) => a + b, 0) / studentGrades.get(student.id)!.length
        : null
    }));
  }
);

