/**
 * Permission/ACL utility functions
 * Supports granular permission checking based on user.permissions array
 */

export const PERMISSION_KEYS = {
  // Students
  STUDENTS_READ_ALL: 'students.read_all',
  STUDENTS_READ_OWN: 'students.read_own',
  STUDENTS_CREATE: 'students.create',
  STUDENTS_UPDATE: 'students.update',
  STUDENTS_DELETE: 'students.delete',

  // Teachers
  TEACHERS_READ_ALL: 'teachers.read_all',
  TEACHERS_CREATE: 'teachers.create',
  TEACHERS_UPDATE: 'teachers.update',
  TEACHERS_DELETE: 'teachers.delete',

  // Messages
  MESSAGES_SEND_ALL: 'messages.send_all',
  MESSAGES_SEND_CLASS: 'messages.send_class',
  MESSAGES_READ_ALL: 'messages.read_all',
  MESSAGES_READ_OWN: 'messages.read_own',

  // Inventory
  INVENTORY_READ: 'inventory.read',
  INVENTORY_MANAGE: 'inventory.manage',

  // Accounts
  ACCOUNTS_READ: 'accounts.read',
  ACCOUNTS_MANAGE: 'accounts.manage',

  // Library
  LIBRARY_READ: 'library.read',
  LIBRARY_MANAGE: 'library.manage',

  // Hostel
  HOSTEL_READ: 'hostel.read',
  HOSTEL_MANAGE: 'hostel.manage',

  // Transport
  TRANSPORT_READ: 'transport.read',
  TRANSPORT_MANAGE: 'transport.manage',

  // Discipline
  DISCIPLINE_READ: 'discipline.read',
  DISCIPLINE_MANAGE: 'discipline.manage',
  DISCIPLINE_REPORT: 'discipline.report',

  // Health
  HEALTH_READ: 'health.read',
  HEALTH_MANAGE: 'health.manage',

  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',

  // Admin
  SETTINGS_MANAGE: 'settings.manage',
  BACKUPS_MANAGE: 'backups.manage',
  USERS_MANAGE: 'users.manage',
  AUDIT_VIEW: 'audit.view',
  SECURITY_MANAGE: 'security.manage',

  // Assignments
  ASSIGNMENTS_READ: 'assignments.read',
  ASSIGNMENTS_MANAGE: 'assignments.manage',

  // Attendance
  ATTENDANCE_MARK: 'attendance.mark',
  ATTENDANCE_READ: 'attendance.read',
};

/**
 * Check if user has a specific permission
 * Admin users (permissions: ["*"]) always return true
 */
export const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions) return false;
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(requiredPermission);
};

/**
 * Check if user has any of the provided permissions (OR logic)
 */
export const hasAnyPermission = (userPermissions, permissions) => {
  if (!userPermissions || !permissions) return false;
  if (userPermissions.includes('*')) return true;
  return permissions.some(p => userPermissions.includes(p));
};

/**
 * Check if user has all provided permissions (AND logic)
 */
export const hasAllPermissions = (userPermissions, permissions) => {
  if (!userPermissions || !permissions) return false;
  if (userPermissions.includes('*')) return true;
  return permissions.every(p => userPermissions.includes(p));
};

/**
 * Default role-to-permissions mapping
 */
export const DEFAULT_ROLE_PERMISSIONS = {
  admin: ['*'],
  teacher: [
    PERMISSION_KEYS.STUDENTS_READ_OWN,
    PERMISSION_KEYS.STUDENTS_UPDATE,
    PERMISSION_KEYS.MESSAGES_SEND_CLASS,
    PERMISSION_KEYS.MESSAGES_READ_ALL,
    PERMISSION_KEYS.DISCIPLINE_REPORT,
    PERMISSION_KEYS.REPORTS_VIEW,
    PERMISSION_KEYS.REPORTS_EXPORT,
    PERMISSION_KEYS.TEACHERS_UPDATE,
    PERMISSION_KEYS.ASSIGNMENTS_MANAGE,
    PERMISSION_KEYS.ATTENDANCE_MARK,
    PERMISSION_KEYS.ATTENDANCE_READ,
    PERMISSION_KEYS.ACCOUNTS_READ,
    PERMISSION_KEYS.LIBRARY_READ,
    PERMISSION_KEYS.HEALTH_READ,
  ],
  parent: [
    PERMISSION_KEYS.STUDENTS_READ_OWN,
    PERMISSION_KEYS.MESSAGES_READ_OWN,
    PERMISSION_KEYS.ASSIGNMENTS_READ,
    PERMISSION_KEYS.ACCOUNTS_READ,
    PERMISSION_KEYS.ATTENDANCE_READ,
  ],
  student: [
    PERMISSION_KEYS.STUDENTS_READ_OWN,
    PERMISSION_KEYS.MESSAGES_READ_OWN,
    PERMISSION_KEYS.ASSIGNMENTS_READ,
    PERMISSION_KEYS.ACCOUNTS_READ,
    PERMISSION_KEYS.ATTENDANCE_READ,
  ],
};

/**
 * Get permissions for a role
 */
export const getPermissionsForRole = (role) => {
  return DEFAULT_ROLE_PERMISSIONS[role] || [];
};

/**
 * Get permission groups (for UI permission pickers)
 */
export const getPermissionGroups = () => {
  return {
    Students: [
      { key: PERMISSION_KEYS.STUDENTS_READ_ALL, label: 'Read All' },
      { key: PERMISSION_KEYS.STUDENTS_READ_OWN, label: 'Read Own' },
      { key: PERMISSION_KEYS.STUDENTS_CREATE, label: 'Create' },
      { key: PERMISSION_KEYS.STUDENTS_UPDATE, label: 'Update' },
      { key: PERMISSION_KEYS.STUDENTS_DELETE, label: 'Delete' },
    ],
    Teachers: [
      { key: PERMISSION_KEYS.TEACHERS_READ_ALL, label: 'Read All' },
      { key: PERMISSION_KEYS.TEACHERS_CREATE, label: 'Create' },
      { key: PERMISSION_KEYS.TEACHERS_UPDATE, label: 'Update' },
      { key: PERMISSION_KEYS.TEACHERS_DELETE, label: 'Delete' },
    ],
    Messages: [
      { key: PERMISSION_KEYS.MESSAGES_SEND_ALL, label: 'Send to All' },
      { key: PERMISSION_KEYS.MESSAGES_SEND_CLASS, label: 'Send to Class' },
      { key: PERMISSION_KEYS.MESSAGES_READ_ALL, label: 'Read All' },
      { key: PERMISSION_KEYS.MESSAGES_READ_OWN, label: 'Read Own' },
    ],
    Discipline: [
      { key: PERMISSION_KEYS.DISCIPLINE_READ, label: 'Read' },
      { key: PERMISSION_KEYS.DISCIPLINE_MANAGE, label: 'Manage' },
      { key: PERMISSION_KEYS.DISCIPLINE_REPORT, label: 'Report' },
    ],
    Inventory: [
      { key: PERMISSION_KEYS.INVENTORY_READ, label: 'Read' },
      { key: PERMISSION_KEYS.INVENTORY_MANAGE, label: 'Manage' },
    ],
    Admin: [
      { key: PERMISSION_KEYS.SETTINGS_MANAGE, label: 'Settings' },
      { key: PERMISSION_KEYS.BACKUPS_MANAGE, label: 'Backups' },
      { key: PERMISSION_KEYS.USERS_MANAGE, label: 'Users' },
      { key: PERMISSION_KEYS.AUDIT_VIEW, label: 'Audit Logs' },
      { key: PERMISSION_KEYS.SECURITY_MANAGE, label: 'Security' },
    ],
  };
};
