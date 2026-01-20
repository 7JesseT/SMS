import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  loading: false,
  theme: 'gold',
  darkMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setLoading, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
