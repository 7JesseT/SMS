import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, AuthUser, UserRole } from '../types';
import { authApi, api } from '../services/api';

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

// API response types
interface AuthResponse {
  user: {
    _id: string;
    name?: string;
    email?: string;
    rollNum?: number;
    schoolName?: string;
    school?: { _id: string; schoolName: string } | string;
    sclassName?: { _id: string; sclassName: string } | string;
    teachSubject?: { _id: string; subName: string };
    teachSclass?: { _id: string; sclassName: string };
  };
  role: UserRole;
}

// Transform API response to AuthUser
const transformUserResponse = (data: AuthResponse): AuthUser => {
  const { user, role } = data;
  
  // Store full user data for components that need it
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('userRole', role);
  
  return {
    id: user._id,
    email: user.email || user.rollNum?.toString() || '',
    role: role,
    name: user.name || user.schoolName || 'User',
    avatar: undefined,
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Verify session with backend
  const verifySession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authApi.getCurrentUser();
      const authUser = transformUserResponse(response.data);
      setUser(authUser);
      localStorage.setItem('authUser', JSON.stringify(authUser));
      return true;
    } catch {
      // Session invalid or expired
      setUser(null);
      localStorage.removeItem('authUser');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userRole');
      return false;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // Try to verify existing session with backend
        await verifySession();
      } catch {
        // No valid session
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [verifySession]);

  // Login handlers for each user type
  const loginAdmin = async (email: string, password: string): Promise<void> => {
    const response = await api.post('/AdminLogin', { email, password });
    
    if (response.data.message) {
      throw new Error(response.data.message);
    }
    
    const authUser = transformUserResponse(response.data);
    setUser(authUser);
    localStorage.setItem('authUser', JSON.stringify(authUser));
  };

  const loginStudent = async (rollNum: number, studentName: string, password: string): Promise<void> => {
    const response = await api.post('/StudentLogin', { rollNum, studentName, password });
    
    if (response.data.message) {
      throw new Error(response.data.message);
    }
    
    const authUser = transformUserResponse(response.data);
    setUser(authUser);
    localStorage.setItem('authUser', JSON.stringify(authUser));
  };

  const loginTeacher = async (email: string, password: string): Promise<void> => {
    const response = await api.post('/TeacherLogin', { email, password });
    
    if (response.data.message) {
      throw new Error(response.data.message);
    }
    
    const authUser = transformUserResponse(response.data);
    setUser(authUser);
    localStorage.setItem('authUser', JSON.stringify(authUser));
  };

  // Generic login (for backward compatibility if needed)
  const login = async (): Promise<void> => {
    throw new Error('Use specific login methods: loginAdmin, loginStudent, loginTeacher');
  };

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      localStorage.removeItem('authUser');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userRole');
    }
  }, []);

  // Get full user data (for components that need more than AuthUser)
  const getCurrentUserData = () => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  };

  const value: AuthContextType & {
    loginAdmin: (email: string, password: string) => Promise<void>;
    loginStudent: (rollNum: number, studentName: string, password: string) => Promise<void>;
    loginTeacher: (email: string, password: string) => Promise<void>;
    getCurrentUserData: () => unknown;
    isInitialized: boolean;
    verifySession: () => Promise<boolean>;
  } = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    login,
    logout,
    loginAdmin,
    loginStudent,
    loginTeacher,
    getCurrentUserData,
    verifySession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
