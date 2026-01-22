import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/common/Layout';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import StudentsPage from '../pages/admin/StudentsPage';
import TeachersPage from '../pages/admin/TeachersPage';
import ClassesPage from '../pages/admin/ClassesPage';
import SubjectsPage from '../pages/admin/SubjectsPage';
import NoticesPage from '../pages/admin/NoticesPage';
import ComplaintsPage from '../pages/admin/ComplaintsPage';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherClassesPage from '../pages/teacher/ClassesPage';
import AttendancePage from '../pages/teacher/AttendancePage';
import GradesPage from '../pages/teacher/GradesPage';
import TeacherProfilePage from '../pages/teacher/ProfilePage';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentGradesPage from '../pages/student/GradesPage';
import StudentAttendancePage from '../pages/student/AttendancePage';
import StudentNoticesPage from '../pages/student/NoticesPage';
import StudentComplaintsPage from '../pages/student/ComplaintsPage';
import StudentProfilePage from '../pages/student/ProfilePage';

import { ProtectedRoute } from '../components/auth/ProtectedRoute';

const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to={`/${user?.role.toLowerCase()}/dashboard`} replace />
            ) : (
              <LoginPage />
            )
          } 
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="notices" element={<NoticesPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['Teacher']}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClassesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="grades" element={<GradesPage />} />
          <Route path="profile" element={<TeacherProfilePage />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="grades" element={<StudentGradesPage />} />
          <Route path="attendance" element={<StudentAttendancePage />} />
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