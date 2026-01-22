// Class and Subject types

export interface SClass {
  _id: string;
  sclassName: string;
  school: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subject {
  _id: string;
  subName: string;
  subCode: string;
  sessions: number;
  sclassName: {
    _id: string;
    sclassName: string;
  };
  school: string;
  teacher?: {
    _id: string;
    name: string;
  };
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectInput {
  subName: string;
  subCode: string;
  sessions: number;
  sclassName: string;
  description?: string;
}

export interface Notice {
  _id: string;
  title: string;
  details: string;
  date: string;
  author: string;
  school: string;
  target?: 'All' | 'Admin' | 'Teacher' | 'Student';
  createdAt?: string;
  updatedAt?: string;
}

export interface NoticeInput {
  title: string;
  details: string;
  date: string;
  target: 'All' | 'Admin' | 'Teacher' | 'Student';
}

export interface Complaint {
  _id: string;
  user: {
    _id: string;
    name: string;
    rollNum?: string;
  };
  title: string;
  complaint: string;
  date: string;
  school: string;
  status?: 'Pending' | 'Resolved';
  createdAt?: string;
  updatedAt?: string;
}

export interface ComplaintInput {
  title: string;
  complaint: string;
  date: string;
}
