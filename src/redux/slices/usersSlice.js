import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Async thunk for loading users from localStorage
export const loadUsers = createAsyncThunk('users/loadUsers', async (_, { rejectWithValue }) => {
  try {
    await new Promise(res => setTimeout(res, 200));
    const data = localStorage.getItem('hof_data');
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.users || [];
    }
    return [];
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Add new user
    addUser: (state, action) => {
      const newUser = {
        id: `USR-${uuidv4().slice(0, 8)}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.users.push(newUser);
      state.error = null;
    },

    // Update user
    updateUser: (state, action) => {
      const idx = state.users.findIndex(u => u.id === action.payload.id);
      if (idx !== -1) {
        state.users[idx] = { ...state.users[idx], ...action.payload };
      }
      state.error = null;
    },

    // Delete user
    deleteUser: (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
      state.error = null;
    },

    // Set user permissions
    setUserPermissions: (state, action) => {
      const { userId, permissions } = action.payload;
      const idx = state.users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        state.users[idx].permissions = permissions;
      }
      state.error = null;
    },

    // Bulk set users
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addUser,
  updateUser,
  deleteUser,
  setUserPermissions,
  setUsers,
  setError,
  clearError,
} = usersSlice.actions;

export default usersSlice.reducer;
