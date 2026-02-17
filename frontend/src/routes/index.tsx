import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import LandingPage from '../pages/LandingPage';
import NotFoundPage from '../pages/NotFoundPage';
import StudentLoginPage from '../pages/student/StudentLoginPage';
import StudentRegisterPage from '../pages/student/StudentRegisterPage';
import TeacherLoginPage from '../pages/teacher/TeacherLoginPage';
import TeacherRegisterPage from '../pages/teacher/TeacherRegisterPage';

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminRegisterPage from '../pages/admin/AdminRegisterPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProfilePage from '../pages/admin/AdminProfilePage';
import ClassesManagementPage from '../pages/admin/ClassesManagementPage';
import SubjectsManagementPage from '../pages/admin/SubjectsManagementPage';
import NoticesManagementPage from '../pages/admin/NoticesManagementPage';
import ComplaintsPage from '../pages/admin/ComplaintsPage';
import { AdminCalendarManagementPage } from '../pages/admin/AdminCalendarManagementPage';
import { AdminPrayerScheduleManagementPage } from '../pages/admin/AdminPrayerScheduleManagementPage';
import { AdminMarksManagementPage } from '../pages/admin/AdminMarksManagementPage';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherProfilePage from '../pages/teacher/TeacherProfilePage';
import ReportAttendancePage from '../pages/teacher/ReportAttendancePage';
import { MarksInputPage } from '../pages/teacher/MarksInputPage';
import { StudentReportPage } from '../pages/teacher/StudentReportPage';
import { TeacherAnnouncementsPage } from '../pages/teacher/TeacherAnnouncementsPage';
import { TeacherCalendarPage } from '../pages/teacher/TeacherCalendarPage';
import TeacherAcademicCalendarPage from '../pages/teacher/TeacherAcademicCalendarPage';
import TeacherNoticesPage from '../pages/teacher/TeacherNoticesPage';
import TeacherPrayerSchedulePage from '../pages/teacher/TeacherPrayerSchedulePage';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentGradesPage from '../pages/student/GradesPage';
import StudentAttendancePage from '../pages/student/AttendancePage';
import StudentNoticesPage from '../pages/student/NoticesPage';
import StudentComplaintsPage from '../pages/student/ComplaintsPage';
import StudentProfilePage from '../pages/student/ProfilePage';
import StudentSubjectsPage from '../pages/student/SubjectsPage';
import ProfileEditPage from '../pages/student/ProfileEditPage';
import ExamResultsPage from '../pages/student/ExamResultsPage';
import { AnnouncementsPage } from '../pages/student/AnnouncementsPage';
import AcademicCalendarPage from '../pages/student/AcademicCalendarPage';
import PrayerSchedulePage from '../pages/student/PrayerSchedulePage';

import { ProtectedRoute } from '../components/auth/ProtectedRoute';

const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const roleSlug = user?.role?.toLowerCase();
  const dashboardPath = roleSlug ? `/${roleSlug}/dashboard` : '/';

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to={dashboardPath} replace />
            ) : (
              <StudentLoginPage />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to={dashboardPath} replace />
            ) : (
              <StudentRegisterPage />
            )
          } 
        />
        <Route 
          path="/teacher/login" 
          element={
            isAuthenticated ? (
              <Navigate to={dashboardPath} replace />
            ) : (
              <TeacherLoginPage />
            )
          } 
        />
        <Route 
          path="/teacher/register" 
          element={
            isAuthenticated ? (
              <Navigate to={dashboardPath} replace />
            ) : (
              <TeacherRegisterPage />
            )
          } 
        />
        <Route 
          path="/admin/login" 
          element={
            isAuthenticated ? (
              <Navigate to={dashboardPath} replace />
            ) : (
              <AdminLoginPage />
            )
          } 
        />
        <Route 
          path="/admin/register" 
          element={
            isAuthenticated ? (
              <Navigate to={dashboardPath} replace />
            ) : (
              <AdminRegisterPage />
            )
          } 
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="classes" element={<ClassesManagementPage />} />
          <Route path="subjects" element={<SubjectsManagementPage />} />
          <Route path="notices" element={<NoticesManagementPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="calendar" element={<AdminCalendarManagementPage />} />
          <Route path="prayer-schedule" element={<AdminPrayerScheduleManagementPage />} />
          <Route path="marks" element={<AdminMarksManagementPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['Teacher']}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="profile" element={<TeacherProfilePage />} />
          <Route path="attendance" element={<ReportAttendancePage />} />
          <Route path="marks-input" element={<MarksInputPage />} />
          <Route path="student-report" element={<StudentReportPage />} />
          <Route path="announcements" element={<TeacherAnnouncementsPage />} />
          <Route path="calendar" element={<TeacherCalendarPage />} />
          <Route path="academic-calendar" element={<TeacherAcademicCalendarPage />} />
          <Route path="notices" element={<TeacherNoticesPage />} />
          <Route path="prayers" element={<TeacherPrayerSchedulePage />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
          <Route path="exam-results" element={<ExamResultsPage />} />
          <Route path="notices" element={<StudentNoticesPage />} />
          <Route path="calendar" element={<AcademicCalendarPage />} />
          <Route path="prayers" element={<PrayerSchedulePage />} />
          <Route path="grades" element={<StudentGradesPage />} />
          <Route path="attendance" element={<StudentAttendancePage />} />
          <Route path="subjects" element={<StudentSubjectsPage />} />
          <Route path="complaints" element={<StudentComplaintsPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;