import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '../types';
import { api } from '../services/api';

interface CoursesState {
  courses: Course[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  status: 'idle',
  error: null,
};

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
  return await api.getCourses();
});

export const addCourse = createAsyncThunk('courses/addCourse', async (course: Omit<Course, 'id'>) => {
  return await api.addCourse(course);
});

export const updateCourse = createAsyncThunk('courses/updateCourse', async (course: Course) => {
  return await api.updateCourse(course);
});

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (id: number) => {
  await api.deleteCourse(id);
  return id;
});

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch courses';
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course.id !== action.payload);
      });
  },
});

export default coursesSlice.reducer;

