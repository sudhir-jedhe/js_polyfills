import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Teacher } from '../types';
import { api } from '../services/api';

interface TeachersState {
  teachers: Teacher[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TeachersState = {
  teachers: [],
  status: 'idle',
  error: null,
};

export const fetchTeachers = createAsyncThunk('teachers/fetchTeachers', async () => {
  return await api.getTeachers();
});

export const addTeacher = createAsyncThunk('teachers/addTeacher', async (teacher: Omit<Teacher, 'id'>) => {
  return await api.addTeacher(teacher);
});

export const updateTeacher = createAsyncThunk('teachers/updateTeacher', async (teacher: Teacher) => {
  return await api.updateTeacher(teacher);
});

export const deleteTeacher = createAsyncThunk('teachers/deleteTeacher', async (id: number) => {
  await api.deleteTeacher(id);
  return id;
});

const teachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch teachers';
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.teachers.push(action.payload);
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const index = state.teachers.findIndex(teacher => teacher.id === action.payload.id);
        if (index !== -1) {
          state.teachers[index] = action.payload;
        }
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter(teacher => teacher.id !== action.payload);
      });
  },
});

export default teachersSlice.reducer;

