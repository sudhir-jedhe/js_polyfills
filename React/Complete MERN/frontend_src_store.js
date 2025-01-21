import { configureStore } from "@reduxjs/toolkit"
import { createLogger } from "redux-logger"
import thunk from "redux-thunk"
import authReducer from "./slices/authSlice"
import userReducer from "./slices/userSlice"

// Create a custom logger middleware
const logger = createLogger({
  collapsed: true,
  diff: true,
})

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(thunk)
      .concat(process.env.NODE_ENV !== "production" ? logger : []),
  devTools: process.env.NODE_ENV !== "production",
})

export default store

