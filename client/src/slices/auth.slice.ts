import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: true
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.loading = false;
      window.localStorage.removeItem('token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
})

// Action creators are generated for each case reducer function
export const { login, logout, setLoading } = authSlice.actions

export default authSlice.reducer

