import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  error: null,
};

// Simulating API calls with JSONPlaceholder
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await axios.get<Todo[]>(API_URL);
  return response.data.slice(0, 10); // Limit to 10 todos for this example
});

export const addTodo = createAsyncThunk('todos/addTodo', async (title: string) => {
  const response = await axios.post<Todo>(API_URL, {
    title,
    completed: false,
  });
  return response.data;
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async (todo: Todo) => {
  const response = await axios.put<Todo>(`${API_URL}/${todo.id}`, todo);
  return response.data;
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      });
  },
});

export const { toggleTodo } = todoSlice.actions;
export default todoSlice.reducer;

