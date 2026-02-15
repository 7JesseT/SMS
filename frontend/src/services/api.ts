import axios from 'axios';

// Use environment variable with fallback to local development URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for httpOnly cookies
});

// Auth API
export const authApi = {
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stale auth data and redirect to landing
      localStorage.removeItem('authUser');
      localStorage.removeItem('userRole');
      
      // Only redirect if not already on a login/landing page
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/login', '/admin-login', '/student-login', '/teacher-login'];
      if (!publicPaths.some(path => currentPath === path || currentPath.startsWith(path))) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Student Authentication
export const studentApi = {
  register: (data: {
    name: string;
    rollNum: number;
    password: string;
    sclassName: string;
    adminID: string;
  }) => api.post('/StudentReg', data),

  login: (data: {
    rollNum: number;
    studentName: string;
    password: string;
  }) => api.post('/StudentLogin', data),

  getDetails: (id: string) => api.get(`/Student/${id}`),

  update: (id: string, data: { name: string }) => api.put(`/Student/${id}`, data),

  updateProfile: (id: string, data: FormData) => api.put(`/StudentProfile/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  bulkUpdateExamResults: (data: {
    students: { studentId: string; marksObtained: number }[];
    examName: string;
    subName: string;
    date: string;
    totalMarks: number;
  }) => api.post('/BulkUpdateExamResults', data),
};

// Complaints
export const complainApi = {
  create: (data: {
    user: string;
    date: string;
    complaint: string;
    school: string;
  }) => api.post('/ComplainCreate', data),
};

// Academic Calendar
export const calendarApi = {
  create: (data: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    eventType: string;
    school: string;
  }) => api.post('/CalendarCreate', data),

  getAll: (schoolId: string) => api.get(`/Calendar/${schoolId}`),

  update: (id: string, data: {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    eventType?: string;
  }) => api.put(`/Calendar/${id}`, data),

  delete: (id: string) => api.delete(`/Calendar/${id}`),
};

// Prayer Schedule
export const prayerApi = {
  create: (data: {
    prayerName: string;
    time: string;
    description?: string;
    school: string;
  }) => api.post('/PrayerCreate', data),

  getAll: (schoolId: string) => api.get(`/Prayers/${schoolId}`),

  update: (id: string, data: {
    prayerName?: string;
    time?: string;
    description?: string;
  }) => api.put(`/Prayer/${id}`, data),

  delete: (id: string) => api.delete(`/Prayer/${id}`),
};
