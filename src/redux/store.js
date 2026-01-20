import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dataReducer from './slices/dataSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';
import usersReducer from './slices/usersSlice';
import auditReducer from './slices/auditSlice';
import backupReducer from './slices/backupSlice';
import settingsReducer from './slices/settingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    notification: notificationReducer,
    ui: uiReducer,
    users: usersReducer,
    audit: auditReducer,
    backup: backupReducer,
    settings: settingsReducer,
  },
});

// Persist auth and data to localStorage
store.subscribe(() => {
  const state = store.getState();
  // Persist auth
  localStorage.setItem('hof_user', JSON.stringify(state.auth.user));
  // Persist data
  localStorage.setItem('hof_data', JSON.stringify(state.data));
  // Persist backups
  localStorage.setItem('hof_backups', JSON.stringify(state.backup.backups));
  // Persist audit logs
  localStorage.setItem('hof_audit', JSON.stringify(state.audit.logs));
  // Persist settings
  localStorage.setItem('hof_settings', JSON.stringify(state.settings));
});

export default store;
