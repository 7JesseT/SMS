import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  schoolInfo: {
    name: 'The Heart of Our Father School',
    address: '123 Educational Street, Kampala, Uganda',
    phone: '+256-754-123-456',
    email: 'info@hof.local',
    logo: null,
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    notificationFrequency: 'realtime', // realtime, daily, weekly
  },
  security: {
    twoFAEnabled: false,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
    },
    sessionTimeout: 3600, // seconds
  },
  features: {
    allowSelfMark: false, // students marking own attendance
    allowParentPayments: true,
  },
  theme: {
    primaryColor: '#D4AF37', // gold (locked)
    language: 'en',
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSchoolInfo: (state, action) => {
      state.schoolInfo = { ...state.schoolInfo, ...action.payload };
    },

    updateNotifications: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },

    updateSecurity: (state, action) => {
      state.security = { ...state.security, ...action.payload };
    },

    updateFeatures: (state, action) => {
      state.features = { ...state.features, ...action.payload };
    },

    updateLanguage: (state, action) => {
      state.theme.language = action.payload;
    },

    setSettings: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  updateSchoolInfo,
  updateNotifications,
  updateSecurity,
  updateFeatures,
  updateLanguage,
  setSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
