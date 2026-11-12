import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "@/features/auth/authSlice";
import { adminAuthApi } from "@/api/adminAuthApi";
import { dashboardApi } from "@/api/dashboardApi"; // <-- नया इम्पोर्ट

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer, // <-- नया रिड्यूसर
  },
  middleware: (getDefault) =>
    getDefault()
      .concat(adminAuthApi.middleware)
      .concat(dashboardApi.middleware), // <-- नया मिडलवेयर
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;