import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, AuthUser, LoginCredentials, UserRole } from '../types';

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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock authentication logic
      const mockUser: AuthUser = {
        id: credentials.email,
        email: credentials.email,
        role: credentials.role,
        name: getMockUserName(credentials.email, credentials.role),
        avatar: undefined,
      };

      setUser(mockUser);
      // Store in localStorage for persistence
      localStorage.setItem('authUser', JSON.stringify(mockUser));
    } catch (error) {
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
