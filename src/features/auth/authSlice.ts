import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface User {
  id: string;
  email: string;
  role: string;
  company: {
    name: string;
    logo?: string;
    address?: string;
    phone?: string;
    website?: string;
    taxId?: string;
  };
  settings: {
    defaultCurrency: string;
    language: string;
    dateFormat: string;
    theme: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUserSettings: (
      state,
      action: PayloadAction<{
        defaultCurrency?: string;
        language?: string;
        dateFormat?: string;
        theme?: string;
      }>
    ) => {
      if (state.user) {
        state.user.settings = {
          ...state.user.settings,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  updateUserSettings,
} = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer; 