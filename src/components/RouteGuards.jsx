import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * RequireAuth: Guard to ensure user is authenticated
 */
export const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

/**
 * AdminOnly: Guard for Admin-only pages
 */
export const AdminOnly = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role !== 'Admin') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen bg-beige-100"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gold-700 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
};

/**
 * TeacherOnly: Guard for Teacher-only pages
 */
export const TeacherOnly = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!['Admin', 'Teacher'].includes(user?.role)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen bg-beige-100"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gold-700 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
};

/**
 * ParentOnly: Guard for Parent-only pages
 */
export const ParentOnly = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!['Admin', 'Parent'].includes(user?.role)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen bg-beige-100"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gold-700 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
};
