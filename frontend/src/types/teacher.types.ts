// Teacher-related types

import type { Gender, Status } from './common.types';

export interface Teacher {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'Teacher';
  school: string;
  teachSubject?: {
    _id: string;
    subName: string;
    subCode?: string;
  };
  teachSclass?: {
    _id: string;
    sclassName: string;
  };
  attendance?: TeacherAttendance[];
  gender?: Gender;
  dateOfBirth?: string;
  qualification?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  status?: Status;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherInput {
  name: string;
  email: string;
  password: string;
  teachSubject?: string;
  teachSclass?: string;
  gender?: Gender;
  dateOfBirth?: string;
  qualification?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface TeacherAttendance {
  _id?: string;
  date: string;
  presentCount?: number;
  absentCount?: number;
  status: 'Present' | 'Absent';
}

export interface ClassAssignment {
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  studentCount: number;
}
