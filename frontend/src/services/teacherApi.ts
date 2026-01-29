import { api } from './api';

export interface TeacherRegisterData {
  name: string;
  email: string;
  password: string;
  school: string;
  teachSubject: string;
  teachSclass: string;
}

export interface TeacherLoginData {
  email: string;
  password: string;
}

export interface TeacherUpdateSubjectData {
  teacherId: string;
  teachSubject: string;
}

export interface TeacherAttendanceData {
  date: string;
  presentCount: string;
  absentCount: string;
}

export interface TeacherDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  school: any;
  teachSubject: any;
  teachSclass: any;
  attendance: any[];
  createdAt: string;
  updatedAt: string;
}

// Teacher API endpoints
export const teacherApi = {
  register: (data: TeacherRegisterData) => api.post('/TeacherReg', data),

  login: (data: TeacherLoginData) => api.post('/TeacherLogin', data),

  getDetails: (id: string) => api.get<TeacherDetails>(`/Teacher/${id}`),

  updateSubject: (data: TeacherUpdateSubjectData) => api.put('/TeacherSubject', data),

  reportAttendance: (id: string, data: TeacherAttendanceData) => 
    api.post(`/TeacherAttendance/${id}`, data),
};
