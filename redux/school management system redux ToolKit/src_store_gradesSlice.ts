import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Grade } from '../types';
import { api } from '../services/api';

interface GradesState {
  grades: Grade[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GradesState = {
  grades: [],
  status: 'idle',
  error: null,
};

export const fetchGrades = createAsyncThunk('grades/fetchGrades', async () => {
  return await api.getGrades();
});

export const addGrade = createAsyncThunk('grades/addGrade', async (grade: Omit<Grade, 'id'>) => {
  return await api.addGrade(grade);
});

export const updateGrade = createAsyncThunk('grades/updateGrade', async (grade: Grade) => {
  return await api.updateGrade(grade);
});

export const deleteGrade = createAsyncThunk('grades/deleteGrade', async (id: number) => {
  await api.deleteGrade(id);
  return id;
});

const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGrades.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.grades = action.payload;
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch grades';
      })
      .addCase(addGrade.fulfilled, (state, action) => {
        state.grades.push(action.payload);
      })
      .addCase(updateGrade.fulfilled, (state, action) => {
        const index = state.grades.findIndex(grade => grade.id === action.payload.id);
        if (index !== -1) {
          state.grades[index] = action.payload;
        }
      })
      .addCase(deleteGrade.fulfilled, (state, action) => {
        state.grades = state.grades.filter(grade => grade.id !== action.payload);
      });
  },
});

export default gradesSlice.reducer;

