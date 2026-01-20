import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  backups: [],
  loading: false,
  error: null,
};

const backupSlice = createSlice({
  name: 'backup',
  initialState,
  reducers: {
    createBackup: (state, action) => {
      const backup = {
        id: `BACKUP-${new Date().toISOString().split('T')[0]}-${uuidv4().slice(0, 4)}`,
        name: action.payload.name,
        createdAt: new Date().toISOString(),
        createdBy: action.payload.userId,
        data: action.payload.data,
      };
      state.backups.push(backup);
      state.error = null;
    },

    deleteBackup: (state, action) => {
      state.backups = state.backups.filter(b => b.id !== action.payload);
    },

    setBackups: (state, action) => {
      state.backups = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { createBackup, deleteBackup, setBackups, setLoading, setError, clearError } = backupSlice.actions;
export default backupSlice.reducer;
