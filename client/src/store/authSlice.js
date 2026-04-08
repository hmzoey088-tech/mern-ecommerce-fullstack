import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = 'succeeded';
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.status = 'idle';
      state.error = null;
    },
    setError(state, action) {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

export const { setCredentials, logout, setError } = authSlice.actions;
export default authSlice.reducer;
