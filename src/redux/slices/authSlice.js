import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('hof_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('hof_user');
    },
    switchRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload;
        localStorage.setItem('hof_user', JSON.stringify(state.user));
      }
    },
    loadUserFromLocalStorage: (state) => {
      const savedUser = localStorage.getItem('hof_user');
      if (savedUser) {
        try {
          state.user = JSON.parse(savedUser);
          state.isAuthenticated = true;
        } catch (error) {
          console.error('Failed to load user from localStorage:', error);
        }
      }
    },
  },
});

export const { login, logout, switchRole, loadUserFromLocalStorage } = authSlice.actions;
export default authSlice.reducer;
