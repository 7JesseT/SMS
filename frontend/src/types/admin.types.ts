// Admin-related types

export interface Admin {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'Admin';
  schoolName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  totalNotices: number;
  pendingComplaints: number;
}

export interface RecentActivity {
  id: string;
  type: 'student' | 'teacher' | 'notice' | 'complaint';
  title: string;
  description: string;
  timestamp: string;
}
