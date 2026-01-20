import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  logs: [],
};

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    addAuditLog: (state, action) => {
      const log = {
        id: `LOG-${uuidv4().slice(0, 8)}`,
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.logs.push(log);
    },

    setLogs: (state, action) => {
      state.logs = action.payload;
    },

    clearLogs: (state) => {
      state.logs = [];
    },
  },
});

export const { addAuditLog, setLogs, clearLogs } = auditSlice.actions;
export default auditSlice.reducer;
