import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminUser {
  id: number;
  mobile_number: string;
  full_name: string;
  is_verified: boolean;
  is_active: boolean;
  is_super_admin: boolean;
  last_login_at: string | null;
  created_at: string;
}

interface AuthState {
  token: string | null;
  expiresAt: string | null;
  admin: AdminUser | null;
  pendingMobile: string | null;
}

const STORAGE_KEY = "usanex.admin.auth";

function loadInitialState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        token: null,
        expiresAt: null,
        admin: null,
        pendingMobile: null,
      };
    }
    const parsed = JSON.parse(raw) as AuthState;
    if (parsed.expiresAt && new Date(parsed.expiresAt) <= new Date()) {
      localStorage.removeItem(STORAGE_KEY);
      return {
        token: null,
        expiresAt: null,
        admin: null,
        pendingMobile: null,
      };
    }
    return parsed;
  } catch {
    return {
      token: null,
      expiresAt: null,
      admin: null,
      pendingMobile: null,
    };
  }
}

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        expiresAt: string;
        admin: AdminUser;
      }>
    ) => {
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
      state.admin = action.payload.admin;
      state.pendingMobile = null;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    setAdmin: (state, action: PayloadAction<AdminUser>) => {
      state.admin = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    setPendingMobile: (state, action: PayloadAction<string | null>) => {
      state.pendingMobile = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    logout: (state) => {
      state.token = null;
      state.expiresAt = null;
      state.admin = null;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
  },
});

export const { setCredentials, setAdmin, setPendingMobile, logout } =
  authSlice.actions;
export default authSlice.reducer;