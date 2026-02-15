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
export interface AcademicCalendar {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: 'Exam' | 'Holiday' | 'Event' | 'Term' | 'Other';
  school: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicCalendarInput {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: 'Exam' | 'Holiday' | 'Event' | 'Term' | 'Other';
}

export interface PrayerSchedule {
  _id: string;
  prayerName: string;
  time: string;
  description?: string;
  school: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrayerScheduleInput {
  prayerName: string;
  time: string;
  description?: string;
}