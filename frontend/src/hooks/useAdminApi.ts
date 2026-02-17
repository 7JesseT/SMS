import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { calendarApi, prayerApi, api } from '../services/api';
import type {
  AcademicCalendarInput,
  PrayerScheduleInput,
} from '../types/entities.types';

// ─────────────────────────────────────────────────────────
// NOTICES HOOKS
// ─────────────────────────────────────────────────────────

/**
 * Hook to fetch all notices for the admin
 */
export const useAdminNotices = (adminId: string | undefined) => {
  return useQuery({
    queryKey: ['notices', 'admin', adminId],
    queryFn: async () => {
      if (!adminId) throw new Error('Admin ID is required to fetch notices');
      const response = await adminApi.getNoticeList(adminId);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!adminId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to create a new notice
 */
export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      details: string;
      date: string;
      adminID: string;
    }) => adminApi.createNotice(data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notices', 'admin', variables.adminID] });
      // Also invalidate teacher/student notice queries so they pick up new notices
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (error: any) => {
      console.error('Failed to create notice:', error);
    },
  });
};

/**
 * Hook to update an existing notice
 */
export const useUpdateNotice = (adminId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noticeId,
      data,
    }: {
      noticeId: string;
      data: { title?: string; details?: string; date?: string };
    }) => adminApi.updateNotice(noticeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices', 'admin', adminId] });
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (error: any) => {
      console.error('Failed to update notice:', error);
    },
  });
};

/**
 * Hook to delete a single notice
 */
export const useDeleteNotice = (adminId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: string) => adminApi.deleteNotice(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices', 'admin', adminId] });
    },
    onError: (error: any) => {
      console.error('Failed to delete notice:', error);
    },
  });
};

/**
 * Hook to delete all notices
 */
export const useDeleteAllNotices = (adminId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!adminId) throw new Error('Admin ID is required');
      return adminApi.deleteAllNotices(adminId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices', 'admin', adminId] });
    },
    onError: (error: any) => {
      console.error('Failed to delete all notices:', error);
    },
  });
};

// ─────────────────────────────────────────────────────────
// ACADEMIC CALENDAR HOOKS
// ─────────────────────────────────────────────────────────

/**
 * Hook to fetch all calendar events for a school
 */
export const useAdminCalendarEvents = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ['calendar', 'admin', schoolId],
    queryFn: async () => {
      if (!schoolId) throw new Error('School ID is required to fetch calendar events');
      const response = await calendarApi.getAll(schoolId);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new calendar event
 */
export const useCreateCalendarEvent = (_schoolId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AcademicCalendarInput & { school: string }) =>
      calendarApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
    onError: (error: any) => {
      console.error('Failed to create calendar event:', error);
    },
  });
};

/**
 * Hook to update an existing calendar event
 */
export const useUpdateCalendarEvent = (_schoolId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: Partial<AcademicCalendarInput>;
    }) => calendarApi.update(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
    onError: (error: any) => {
      console.error('Failed to update calendar event:', error);
    },
  });
};

/**
 * Hook to delete a calendar event
 */
export const useDeleteCalendarEvent = (_schoolId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => calendarApi.delete(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete calendar event:', error);
    },
  });
};

// ─────────────────────────────────────────────────────────
// PRAYER SCHEDULE HOOKS
// ─────────────────────────────────────────────────────────

/**
 * Hook to fetch all prayer schedules for a school
 */
export const useAdminPrayerSchedules = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ['prayers', 'admin', schoolId],
    queryFn: async () => {
      if (!schoolId) throw new Error('School ID is required to fetch prayer schedules');
      const response = await prayerApi.getAll(schoolId);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!schoolId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to create a new prayer schedule
 */
export const useCreatePrayerSchedule = (_schoolId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PrayerScheduleInput & { school: string }) =>
      prayerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
    },
    onError: (error: any) => {
      console.error('Failed to create prayer schedule:', error);
    },
  });
};

/**
 * Hook to update an existing prayer schedule
 */
export const useUpdatePrayerSchedule = (_schoolId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      prayerId,
      data,
    }: {
      prayerId: string;
      data: Partial<PrayerScheduleInput>;
    }) => prayerApi.update(prayerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
    },
    onError: (error: any) => {
      console.error('Failed to update prayer schedule:', error);
    },
  });
};

/**
 * Hook to delete a prayer schedule
 */
export const useDeletePrayerSchedule = (_schoolId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prayerId: string) => prayerApi.delete(prayerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete prayer schedule:', error);
    },
  });
};

// ─────────────────────────────────────────────────────────
// STUDENT MARKS / RESULTS HOOKS (mirrored from teacher)
// ─────────────────────────────────────────────────────────

/**
 * Hook to fetch all students in a school (for marks management)
 */
export const useAdminStudents = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ['students', 'admin', schoolId],
    queryFn: async () => {
      if (!schoolId) throw new Error('School ID is required to fetch students');
      const response = await api.get(`/Students/${schoolId}`);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single student's full details (including exam results)
 */
export const useAdminStudentDetails = (studentId: string | undefined) => {
  return useQuery({
    queryKey: ['student', 'admin', studentId],
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID is required');
      const response = await api.get(`/Student/${studentId}`);
      return response.data;
    },
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to update a student's exam result marks
 */
export const useAdminUpdateExamResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      subName,
      marksObtained,
    }: {
      studentId: string;
      subName: string;
      marksObtained: number;
    }) =>
      api.put(`/UpdateExamResult/${studentId}`, { subName, marksObtained }),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student', 'admin', variables.studentId] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['examResults'] });
    },
    onError: (error: any) => {
      console.error('Failed to update exam result:', error);
    },
  });
};

/**
 * Hook to bulk update exam results (mirrored from teacher)
 */
export const useAdminBulkUpdateExamResults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      examName: string;
      subName: string;
      date: string;
      totalMarks: number;
      students: { studentId: string; marksObtained: number }[];
    }) => api.post('/BulkUpdateExamResults', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['examResults'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
    onError: (error: any) => {
      console.error('Failed to bulk update exam results:', error);
    },
  });
};

// ─────────────────────────────────────────────────────────
// HELPER: Extract API error message
// ─────────────────────────────────────────────────────────

/**
 * Extracts a user-friendly error message from an API error
 */
export const getApiErrorMessage = (error: any, fallback: string): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return fallback;
};
