import { api } from './api';

// Admin Types
export interface AdminRegisterData {
  name: string;
  email: string;
  password: string;
  schoolName: string;
}

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  schoolName: string;
  __v: number;
}

export interface ClassData {
  _id: string;
  sclassName: string;
  school: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubjectData {
  _id: string;
  subName: string;
  subCode: string;
  sessions: string;
  sclassName: any;
  school: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NoticeData {
  _id: string;
  title: string;
  details: string;
  date: string;
  school: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ComplaintData {
  _id: string;
  user: {
    _id: string;
    name: string;
  } | null;
  date: string;
  complaint: string;
  school: string;
  __v: number;
}

// Admin API endpoints
export const adminApi = {
  // Auth
  register: (data: AdminRegisterData) => api.post('/AdminReg', data),
  login: (data: AdminLoginData) => api.post('/AdminLogin', data),
  getDetails: (id: string) => api.get<AdminDetails>(`/Admin/${id}`),

  // Classes
  createClass: (data: { sclassName: string; adminID: string }) => 
    api.post<ClassData>('/SclassCreate', data),
  getClassList: (id: string) => api.get<ClassData[]>(`/SclassList/${id}`),
  getClassDetails: (id: string) => api.get<ClassData>(`/Sclass/${id}`),
  deleteClass: (id: string) => api.delete<ClassData>(`/Sclass/${id}`),
  deleteAllClasses: (id: string) => 
    api.delete<{ acknowledged: boolean; deletedCount: number }>(`/Sclasses/${id}`),

  // Subjects
  createSubject: (data: {
    subjects: Array<{
      subName: string;
      subCode: string;
      sessions: string;
    }>;
    sclassName: string;
    adminID: string;
  }) => api.post<SubjectData[]>('/SubjectCreate', data),
  getAllSubjects: (id: string) => api.get<SubjectData[]>(`/AllSubjects/${id}`),
  getSubjectDetails: (id: string) => api.get<SubjectData>(`/Subject/${id}`),
  deleteSubject: (id: string) => api.delete<SubjectData>(`/Subject/${id}`),

  // Notices
  createNotice: (data: {
    title: string;
    details: string;
    date: string;
    adminID: string;
    target?: 'All' | 'Admin' | 'Teacher' | 'Student';
  }) => api.post<NoticeData>('/NoticeCreate', data),
  getNoticeList: (id: string) => api.get<NoticeData[]>(`/NoticeList/${id}`),
  updateNotice: (id: string, data: {
    title?: string;
    details?: string;
    date?: string;
    target?: 'All' | 'Admin' | 'Teacher' | 'Student';
  }) => api.put<NoticeData>(`/Notice/${id}`, data),
  deleteNotice: (id: string) => api.delete<NoticeData>(`/Notice/${id}`),
  deleteAllNotices: (id: string) => 
    api.delete<{ acknowledged: boolean; deletedCount: number }>(`/Notices/${id}`),

  // Complaints
  getComplaintList: (id: string) => api.get<ComplaintData[]>(`/ComplainList/${id}`),
};
