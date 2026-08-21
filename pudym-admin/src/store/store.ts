import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/slices/authSlice";
import allUsersReducer from "@/store/slices/AllUsersSlices/allUsersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    allUsers: allUsersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;