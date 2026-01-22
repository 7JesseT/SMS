// Application-wide constants

export const APP_NAME = 'School Management System';
export const APP_SHORT_NAME = 'SMS';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy hh:mm a';
export const DATE_INPUT_FORMAT = 'yyyy-MM-dd';

// Attendance status
export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  EXCUSED: 'Excused',
} as const;

// Complaint status
export const COMPLAINT_STATUS = {
  PENDING: 'Pending',
  RESOLVED: 'Resolved',
} as const;

// Notice targets
export const NOTICE_TARGETS = {
  ALL: 'All',
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
} as const;

// User status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
} as const;

// Gender options
export const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;

// Grade thresholds
export const GRADE_THRESHOLDS = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
  F: 0,
};

// Breakpoints (matching MUI theme)
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

// Sidebar width
export const SIDEBAR_WIDTH = 280;
export const HEADER_HEIGHT = 64;

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  MIN_LENGTH: (length: number) => `Minimum ${length} characters required`,
  MAX_LENGTH: (length: number) => `Maximum ${length} characters allowed`,
  INVALID_PHONE: 'Invalid phone number',
  INVALID_DATE: 'Invalid date',
  PASSWORD_MISMATCH: 'Passwords do not match',
};

// Success messages
export const SUCCESS_MESSAGES = {
  CREATE: (entity: string) => `${entity} created successfully`,
  UPDATE: (entity: string) => `${entity} updated successfully`,
  DELETE: (entity: string) => `${entity} deleted successfully`,
  SAVE: 'Changes saved successfully',
};

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
};
