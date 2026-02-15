import { api } from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { StudentAttendance } from '../types/student.types';
import type {
  Notice,
  AcademicCalendar,
  PrayerSchedule,
} from '../types/entities.types';

// API Response types
export interface StudentDetailsResponse {
  _id: string;
  name: string;
  rollNum: number;
  sclassName: {
    _id: string;
    sclassName: string;
  };
  school: {
    _id: string;
    schoolName: string;
  };
  role: string;
  photo?: string;
  dateOfBirth?: string;
  address?: string;
  guardianName?: string;
  examResult: Array<{
    _id: string;
    subName: {
      _id: string;
      subName: string;
    };
    marksObtained: number;
    totalMarks: number;
    examName: string;
    date: string;
  }>;
  attendance: StudentAttendance[];
  __v?: number;
}

export interface UpdateStudentProfileData {
  name?: string;
  email?: string;
  rollNum?: string | number;
  dateOfBirth?: string;
  address?: string;
  guardianName?: string;
  photo?: File;
}

// Student API endpoints
export const studentApi = {
  // Get student details
  getStudent: (id: string) => api.get<StudentDetailsResponse>(`/Student/${id}`),

  // Update student profile
  updateStudent: (id: string, data: UpdateStudentProfileData) => {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.rollNum) formData.append('rollNum', data.rollNum.toString());
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
    if (data.address) formData.append('address', data.address);
    if (data.guardianName) formData.append('guardianName', data.guardianName);
    if (data.photo) formData.append('photo', data.photo);

    return api.put<StudentDetailsResponse>(`/Student/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get notices for student
  getNotices: (studentId: string) => 
    api.get<Notice[]>(`/NoticeList/${studentId}`),

  // Get academic calendar
  getAcademicCalendar: (schoolId: string) =>
    api.get<AcademicCalendar[]>(`/Calendar/${schoolId}`),

  // Get prayer schedule
  getPrayerSchedule: (schoolId: string) =>
    api.get<PrayerSchedule[]>(`/Prayers/${schoolId}`),
};

// TanStack Query Hooks

/**
 * Hook to fetch student details
 */
export const useStudentDetails = (studentId: string | undefined) => {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID is required');
      const response = await studentApi.getStudent(studentId);
      return response.data;
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update student profile
 */
export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      studentId, 
      data 
    }: { 
      studentId: string; 
      data: UpdateStudentProfileData 
    }) => studentApi.updateStudent(studentId, data),
    onSuccess: (_response, variables) => {
      // Invalidate and refetch student details
      queryClient.invalidateQueries({ queryKey: ['student', variables.studentId] });
    },
  });
};

/**
 * Hook to fetch notices for student
 */
export const useStudentNotices = (studentId: string | undefined) => {
  return useQuery({
    queryKey: ['notices', 'student', studentId],
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID is required');
      const response = await studentApi.getNotices(studentId);
      return response.data;
    },
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch academic calendar
 */
export const useAcademicCalendar = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ['calendar', schoolId],
    queryFn: async () => {
      if (!schoolId) throw new Error('School ID is required');
      const response = await studentApi.getAcademicCalendar(schoolId);
      return response.data;
    },
    enabled: !!schoolId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch prayer schedule
 */
export const usePrayerSchedule = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ['prayers', schoolId],
    queryFn: async () => {
      if (!schoolId) throw new Error('School ID is required');
      const response = await studentApi.getPrayerSchedule(schoolId);
      return response.data;
    },
    enabled: !!schoolId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
