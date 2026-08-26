import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserDetails } from '../types/User';

interface UserSagaState {
  users: User[];
  selectedUserDetails: UserDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserSagaState = {
  users: [],
  selectedUserDetails: null,
  loading: false,
  error: null,
};

const userSagaSlice = createSlice({
  name: 'usersSaga',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUserDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserDetailsSuccess: (state, action: PayloadAction<UserDetails>) => {
      state.loading = false;
      state.selectedUserDetails = action.payload;
    },
    fetchUserDetailsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserDetailsStart,
  fetchUserDetailsSuccess,
  fetchUserDetailsFailure,
} = userSagaSlice.actions;

export default userSagaSlice.reducer;

