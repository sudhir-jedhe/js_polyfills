import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';
import { userApi } from '../api/userApi';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsersThunk = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    return await userApi.getUsers();
  }
);

export const addUserThunk = createAsyncThunk(
  'users/addUser',
  async (user: Omit<User, 'id'>) => {
    return await userApi.addUser(user);
  }
);

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async (user: User) => {
    return await userApi.updateUser(user);
  }
);

export const patchUserThunk = createAsyncThunk(
  'users/patchUser',
  async ({ id, partialUser }: { id: number; partialUser: Partial<User> }) => {
    return await userApi.patchUser(id, partialUser);
  }
);

export const deleteUserThunk = createAsyncThunk(
  'users/deleteUser',
  async (id: number) => {
    await userApi.deleteUser(id);
    return id;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    patchUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(addUserThunk.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(patchUserThunk.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export const { setUsers, addUser, updateUser, patchUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;

