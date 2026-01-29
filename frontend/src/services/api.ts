import axios from 'axios';

const API_BASE_URL = 'http://localhost:10000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
