// Student-related types

import type { Gender, Status } from './common.types';

export interface Student {
  _id: string;
  name: string;
  rollNum: string;
  password: string;
  sclassName: {
    _id: string;
    sclassName: string;
  };
  school: string;
  role: 'Student';
  examResult?: ExamResult[];
  attendance?: StudentAttendance[];
  email?: string;
  gender?: Gender;
  dateOfBirth?: string;
  admissionDate?: string;
  address?: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  avatar?: string;
  status?: Status;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentInput {
  name: string;
  email: string;
  password: string;
  rollNum: string;
  sclassName: string;
  gender?: Gender;
  dateOfBirth?: string;
  admissionDate?: string;
  address?: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  avatar?: string;
}

export interface ExamResult {
  _id?: string;
  subName: {
    _id: string;
    subName: string;
    subCode?: string;
  };
  examName: string;
  marksObtained: number;
  totalMarks: number;
  percentage?: number;
  grade?: string;
  date?: string;
}

export interface StudentAttendance {
  _id?: string;
  date: string;
  status: 'Present' | 'Absent';
  subName?: {
    _id: string;
    subName: string;
  };
}

export interface StudentPerformance {
  student: Student;
  overallAttendance: number;
  subjectWiseGrades: {
    subject: string;
    averageMarks: number;
    grade: string;
  }[];
  recentExams: ExamResult[];
}
