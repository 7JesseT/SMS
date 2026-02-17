import { api } from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  Notice,
  AcademicCalendar,
  PrayerSchedule,
} from '../types/entities.types';

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

export interface ExamResultStudent {
  studentId: string;
  marksObtained: number;
}

export interface BulkExamResultsData {
  examName: string;
  subName: string;
  date: string;
  totalMarks: number;
  students: ExamResultStudent[];
}

export interface BulkExamResultsResponse {
  message: string;
  results: Array<{
    studentId: string;
    success: boolean;
  }>;
}

// Teacher API endpoints
export const teacherApi = {
  register: (data: TeacherRegisterData) => api.post('/TeacherReg', data),

  login: (data: TeacherLoginData) => api.post('/TeacherLogin', data),

  getDetails: (id: string) => api.get<TeacherDetails>(`/Teacher/${id}`),

  updateSubject: (data: TeacherUpdateSubjectData) => api.put('/TeacherSubject', data),

  reportAttendance: (id: string, data: TeacherAttendanceData) => 
    api.post(`/TeacherAttendance/${id}`, data),

  // Bulk update exam results
  bulkUpdateExamResults: (data: BulkExamResultsData) =>
    api.post<BulkExamResultsResponse>('/BulkUpdateExamResults', data),

  // Get notices for teacher
  getNotices: (teacherId: string) =>
    api.get<Notice[]>(`/NoticeList/${teacherId}`),

  // Get academic calendar
  getAcademicCalendar: (schoolId: string) =>
    api.get<AcademicCalendar[]>(`/Calendar/${schoolId}`),

  // Get prayer schedule
  getPrayerSchedule: (schoolId: string) =>
    api.get<PrayerSchedule[]>(`/Prayers/${schoolId}`),
};

// TanStack Query Hooks

/**
 * Hook to bulk update exam results
 */
export const useBulkUpdateExamResults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkExamResultsData) => teacherApi.bulkUpdateExamResults(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['examResults'] });
    },
  });
};

/**
 * Hook to fetch notices for teacher
 */
export const useTeacherNotices = (teacherId: string | undefined) => {
  return useQuery({
    queryKey: ['notices', 'teacher', teacherId],
    queryFn: async () => {
      if (!teacherId) throw new Error('Teacher ID is required');
      const response = await teacherApi.getNotices(teacherId);
      return response.data;
    },
    enabled: !!teacherId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch academic calendar for teacher
 */
export const useTeacherAcademicCalendar = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ['calendar', 'teacher', schoolId],
    queryFn: async () => {
      if (!schoolId) throw new Error('School ID is required');
      const response = await teacherApi.getAcademicCalendar(schoolId);
      return response.data;
    },
    enabled: !!schoolId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch prayer schedule for teacher
 */
export const useTeacherPrayerSchedule = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ['prayers', 'teacher', schoolId],
    queryFn: async () => {
      if (!schoolId) throw new Error('School ID is required');
      const response = await teacherApi.getPrayerSchedule(schoolId);
      return response.data;
    },
    enabled: !!schoolId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Hook to fetch all subjects for a school (filtered by teacher on frontend)
 */
export const useTeacherSubjects = (schoolId: string | undefined, teacherId: string | undefined) => {
  return useQuery({
    queryKey: ['subjects', 'teacher', schoolId, teacherId],
    queryFn: async () => {
      if (!schoolId) throw new Error('School ID is required');
      const response = await api.get(`/AllSubjects/${schoolId}`);
      
      // Filter subjects taught by this teacher
      if (teacherId && Array.isArray(response.data)) {
        return response.data.filter((subject: any) => {
          const subjectTeacherId = subject.teacher?._id || subject.teacher?.id;
          return subjectTeacherId === teacherId;
        });
      }
      
      return response.data;
    },
    enabled: !!schoolId && !!teacherId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch ALL subjects in the school (unfiltered)
 */
export const useAllSubjects = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ['subjects', 'all', schoolId],
    queryFn: async () => {
      if (!schoolId) throw new Error('School ID is required');
      const response = await api.get(`/AllSubjects/${schoolId}`);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch all students for a school
 */
export const useSchoolStudents = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ['students', 'school', schoolId],
    queryFn: async () => {
      if (!schoolId) throw new Error('School ID is required');
      const response = await api.get(`/Students/${schoolId}`);
      
      // Backend returns { message: "No students found" } if no students exist
      // Otherwise it returns an array of students
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch students for a specific class
 */
export const useClassStudents = (classId: string | undefined) => {
  return useQuery({
    queryKey: ['students', 'class', classId],
    queryFn: async () => {
      if (!classId) throw new Error('Class ID is required');
      const response = await api.get(`/Sclass/Students/${classId}`);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
