import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../utils/api"

// Async thunk for user login
export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", { email, password })
    // Store the token in localStorage
    localStorage.setItem("token", response.data.token)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Async thunk for user registration
export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", { username, email, password })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

// Async thunk for loading user data
export const loadUser = createAsyncThunk("auth/loadUser", async (_, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { token },
    } = getState()
    const response = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Async thunk for password reset
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

// Initial state
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
}

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous action for logging out
    logout: (state) => {
      localStorage.removeItem("token")
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.user = null
    },
    // Clear any error messages
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login action
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
      // Handle register action
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
      // Handle loadUser action
      .addCase(loadUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.error = action.payload.message
      })
      // Handle resetPassword action
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
  },
})

export const { logout, clearError } = authSlice.actions

export default authSlice.reducer

