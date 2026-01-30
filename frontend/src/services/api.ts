import axios from 'axios';

// Use environment variable with fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sms-15wv.onrender.com';

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
