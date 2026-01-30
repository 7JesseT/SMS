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

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherProfilePage from '../pages/teacher/TeacherProfilePage';
import ReportAttendancePage from '../pages/teacher/ReportAttendancePage';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentGradesPage from '../pages/student/GradesPage';
import StudentAttendancePage from '../pages/student/AttendancePage';
import StudentNoticesPage from '../pages/student/NoticesPage';
import StudentComplaintsPage from '../pages/student/ComplaintsPage';
import StudentProfilePage from '../pages/student/ProfilePage';
import StudentSubjectsPage from '../pages/student/SubjectsPage';

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
          <Route path="grades" element={<StudentGradesPage />} />
          <Route path="attendance" element={<StudentAttendancePage />} />
          <Route path="subjects" element={<StudentSubjectsPage />} />
          <Route path="notices" element={<StudentNoticesPage />} />
          <Route path="complaints" element={<StudentComplaintsPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;