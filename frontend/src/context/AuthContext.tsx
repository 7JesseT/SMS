import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, AuthUser, LoginCredentials, UserRole } from '../types';
import { studentApi } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      if (credentials.role === 'Student') {
        // Call real student login API
        const response = await studentApi.login({
          rollNum: parseInt(credentials.email), // Using email field for rollNum
          studentName: credentials.password.split(':')[0] || '', // Extract name from password field
          password: credentials.password.split(':')[1] || credentials.password,
        });

        const studentData = response.data;
        
        const authUser: AuthUser = {
          id: studentData._id,
          email: studentData.rollNum.toString(),
          role: 'Student',
          name: studentData.name,
          avatar: undefined,
        };

        setUser(authUser);
        localStorage.setItem('authUser', JSON.stringify(authUser));
      } else {
        // For other roles, keep mock logic for now
        const mockUser: AuthUser = {
          id: credentials.email,
          email: credentials.email,
          role: credentials.role,
          name: getMockUserName(credentials.email, credentials.role),
          avatar: undefined,
        };

        setUser(mockUser);
        localStorage.setItem('authUser', JSON.stringify(mockUser));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  // Helper function to generate mock user names
  const getMockUserName = (email: string, role: UserRole): string => {
    const emailPrefix = email.split('@')[0];
    const formatted = emailPrefix
      .split('.')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return formatted || `${role} User`;
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
