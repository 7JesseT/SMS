import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth() as ReturnType<typeof useAuth> & {
    isInitialized: boolean;
  };

  // Show loading while auth is initializing
  if (!isInitialized || isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Verifying session...
        </Typography>
      </Box>
    );
  }

  // Redirect to landing if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = `/${user.role.toLowerCase()}/dashboard`;
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
