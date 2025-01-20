import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './studentsSlice';
import teachersReducer from './teachersSlice';
import coursesReducer from './coursesSlice';
import gradesReducer from './gradesSlice';
import { loggerMiddleware } from '../middleware/loggerMiddleware';

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    teachers: teachersReducer,
    courses: coursesReducer,
    grades: gradesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

