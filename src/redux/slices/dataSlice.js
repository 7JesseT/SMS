import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dummyData } from '../../mocks/dummyData';

/**
 * PERFORMANCE OPTIMIZATION: Async thunk to load dummy data with simulated delay
 * This allows the UI to show loading state while data is being seeded
 * Delay (300-800ms) simulates network latency and prevents UI freeze
 */
export const loadDummyData = createAsyncThunk(
  'data/loadDummyData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate network delay to allow UI to render loading state
      const delay = Math.random() * 500 + 300; // 300-800ms
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      console.log(`Dummy data loaded in ${Math.round(delay)}ms`);
      return dummyData;
    } catch (error) {
      console.error('Failed to load dummy data:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // OPTIMIZATION: Minimal initial state to reduce memory footprint
  students: [],
  teachers: [],
  messages: [],
  inventory: [],
  transport: { buses: [], planes: [] },
  library: [],
  hostel: { rooms: [], visitorLogs: [] },
  health: [],
  accounts: { incomes: [], expenses: [] },
  reports: {},
  events: [],
  
  // Loading state for async operations
  loading: false,
  error: null,
  dataLoaded: false,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    seedData: (state) => {
      state.students = dummyData.students;
      state.teachers = dummyData.teachers;
      state.messages = dummyData.messages;
      state.inventory = dummyData.inventory;
      state.transport = dummyData.transport;
      state.library = dummyData.library;
      state.hostel = dummyData.hostel;
      state.health = dummyData.health;
      state.accounts = dummyData.accounts;
      state.reports = dummyData.reports;
      state.events = dummyData.events;
      state.dataLoaded = true;
    },
    // Student mutations
    addStudent: (state, action) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action) => {
      const index = state.students.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    deleteStudent: (state, action) => {
      state.students = state.students.filter((s) => s.id !== action.payload);
    },
    // Teacher mutations
    addTeacher: (state, action) => {
      state.teachers.push(action.payload);
    },
    updateTeacher: (state, action) => {
      const index = state.teachers.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.teachers[index] = action.payload;
      }
    },
    // Message mutations
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    markMessageAsRead: (state, action) => {
      const message = state.messages.find((m) => m.id === action.payload);
      if (message) {
        message.read = true;
      }
    },
    updateMessages: (state, action) => {
      state.messages = action.payload;
    },
    // Inventory mutations
    updateInventory: (state, action) => {
      const index = state.inventory.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.inventory[index] = action.payload;
      }
    },
    // Hostel mutations
    updateRoom: (state, action) => {
      const index = state.hostel.rooms.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.hostel.rooms[index] = action.payload;
      }
    },
    // Health mutations
    addHealthRecord: (state, action) => {
      state.health.push(action.payload);
    },
    // Events mutations
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },

    // ==================== EXTENDED CRUD OPERATIONS ====================
    
    // STUDENTS - Full CRUD
    deleteStudent: (state, action) => {
      state.students = state.students.filter((s) => s.id !== action.payload);
    },
    
    // TEACHERS - Full CRUD
    deleteTeacher: (state, action) => {
      state.teachers = state.teachers.filter((t) => t.id !== action.payload);
    },
    
    // INVENTORY - Full CRUD
    addInventory: (state, action) => {
      state.inventory.push(action.payload);
    },
    deleteInventory: (state, action) => {
      state.inventory = state.inventory.filter((i) => i.id !== action.payload);
    },
    
    // ACCOUNTS - Full CRUD
    addAccount: (state, action) => {
      state.accounts.push(action.payload);
    },
    updateAccount: (state, action) => {
      const index = state.accounts.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    deleteAccount: (state, action) => {
      state.accounts = state.accounts.filter((a) => a.id !== action.payload);
    },
    
    // LIBRARY - Full CRUD
    addLibraryBook: (state, action) => {
      state.library.push(action.payload);
    },
    updateLibraryBook: (state, action) => {
      const index = state.library.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.library[index] = action.payload;
      }
    },
    deleteLibraryBook: (state, action) => {
      state.library = state.library.filter((b) => b.id !== action.payload);
    },
    
    // TRANSPORT - Full CRUD
    addTransport: (state, action) => {
      if (action.payload.type === 'bus') {
        state.transport.buses.push(action.payload);
      } else if (action.payload.type === 'plane') {
        state.transport.planes.push(action.payload);
      }
    },
    updateTransport: (state, action) => {
      if (action.payload.type === 'bus') {
        const index = state.transport.buses.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.transport.buses[index] = action.payload;
        }
      } else {
        const index = state.transport.planes.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.transport.planes[index] = action.payload;
        }
      }
    },
    deleteTransport: (state, action) => {
      const { id, type } = action.payload;
      if (type === 'bus') {
        state.transport.buses = state.transport.buses.filter((b) => b.id !== id);
      } else {
        state.transport.planes = state.transport.planes.filter((p) => p.id !== id);
      }
    },
    
    // HOSTEL - Full CRUD
    addHostelRoom: (state, action) => {
      state.hostel.rooms.push(action.payload);
    },
    deleteHostelRoom: (state, action) => {
      state.hostel.rooms = state.hostel.rooms.filter((r) => r.id !== action.payload);
    },
    
    // HEALTH - Full CRUD
    updateHealthRecord: (state, action) => {
      const index = state.health.findIndex((h) => h.id === action.payload.id);
      if (index !== -1) {
        state.health[index] = action.payload;
      }
    },
    deleteHealthRecord: (state, action) => {
      state.health = state.health.filter((h) => h.id !== action.payload);
    },
    
    // DELETE EVENT
    deleteEvent: (state, action) => {
      state.events = state.events.filter((e) => e.id !== action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    
    // MESSAGES - Extended
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },
    
    setData: (state, action) => {
      return action.payload;
    },
  },
  
  // PERFORMANCE OPTIMIZATION: Handle async thunk states
  extraReducers: (builder) => {
    builder
      // Loading state
      .addCase(loadDummyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Success state - populate all data
      .addCase(loadDummyData.fulfilled, (state, action) => {
        const data = action.payload;
        state.students = data.students;
        state.teachers = data.teachers;
        state.messages = data.messages;
        state.inventory = data.inventory;
        state.transport = data.transport;
        state.library = data.library;
        state.hostel = data.hostel;
        state.health = data.health;
        state.accounts = data.accounts;
        state.reports = data.reports;
        state.events = data.events;
        state.loading = false;
        state.dataLoaded = true;
        state.error = null;
        console.log('✓ Dummy data loaded successfully');
      })
      // Error state
      .addCase(loadDummyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('✗ Failed to load dummy data:', action.payload);
      });
  },
});

export const {
  seedData,
  addStudent,
  updateStudent,
  deleteStudent,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  addMessage,
  deleteMessage,
  markMessageAsRead,
  updateMessages,
  updateInventory,
  addInventory,
  deleteInventory,
  updateRoom,
  addHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  addEvent,
  updateEvent,
  deleteEvent,
  addAccount,
  updateAccount,
  deleteAccount,
  addLibraryBook,
  updateLibraryBook,
  deleteLibraryBook,
  addTransport,
  updateTransport,
  deleteTransport,
  addHostelRoom,
  deleteHostelRoom,
  setData,
} = dataSlice.actions;
export default dataSlice.reducer;
