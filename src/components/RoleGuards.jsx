import React from 'react';
import { useSelector } from 'react-redux';
import { hasPermission } from '../utils/permissions';

/**
 * AdminOnly - Only renders if user is admin
 */
export const AdminOnly = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96 bg-beige-50 rounded-lg border border-beige-200">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">Access Denied</p>
          <p className="text-gray-600 text-sm mt-2">You do not have permission to view this section.</p>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * TeacherOnly - Only renders if user is teacher
 */
export const TeacherOnly = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== 'teacher') {
    return (
      <div className="flex items-center justify-center h-96 bg-beige-50 rounded-lg border border-beige-200">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">Access Denied</p>
          <p className="text-gray-600 text-sm mt-2">This section is for teachers only.</p>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * ParentOnly - Only renders if user is parent
 */
export const ParentOnly = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || (user.role !== 'parent' && user.role !== 'student')) {
    return (
      <div className="flex items-center justify-center h-96 bg-beige-50 rounded-lg border border-beige-200">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">Access Denied</p>
          <p className="text-gray-600 text-sm mt-2">This section is for parents and students only.</p>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * PermissionGate - Renders if user has specific permission
 */
export const PermissionGate = ({ permission, fallback = null, children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !hasPermission(user.permissions, permission)) {
    return fallback || null;
  }

  return children;
};

/**
 * RequireAuth - Redirect to login if not authenticated
 * This is different from role-based guards; checks if ANY user is logged in
 */
export const RequireAuth = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-beige-50">
        <div className="text-center">
          <p className="text-gray-700 font-semibold text-lg">Please log in to continue</p>
          <p className="text-gray-600 text-sm mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireAuth;
