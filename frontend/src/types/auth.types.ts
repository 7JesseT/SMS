// Authentication and user-related types

export type UserRole = 'Admin' | 'Teacher' | 'Student';

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  _id: string;
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  school?: string;
  photo?: string;
  dateOfBirth?: string;
  address?: string;
  guardianName?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}
