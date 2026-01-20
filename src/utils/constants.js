// Constants for the application
export const ROLES = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  PARENT: 'Parent',
};

export const ROLE_COLORS = {
  Admin: 'gold',
  Teacher: 'blue',
  Parent: 'green',
};

export const MENU_ITEMS = {
  Admin: [
    { label: 'Dashboard', path: '/dashboard', icon: 'FiHome' },
    { label: 'Students', path: '/students', icon: 'FiUsers' },
    { label: 'Teachers', path: '/teachers', icon: 'FiGraduationCap' },
    { label: 'Messages', path: '/messages', icon: 'FiMail' },
    { label: 'Transport', path: '/transport', icon: 'FiBus' },
    { label: 'Discipline', path: '/discipline', icon: 'FiAlertCircle' },
    { label: 'Inventory', path: '/inventory', icon: 'FiBox' },
    { label: 'Library', path: '/library', icon: 'FiBook' },
    { label: 'Hostel', path: '/hostel', icon: 'FiHome' },
    { label: 'Health', path: '/health', icon: 'FiActivity' },
    { label: 'Accounts', path: '/accounts', icon: 'FiDollarSign' },
    { label: 'Reports', path: '/reports', icon: 'FiBarChart2' },
    { label: 'Spiritual', path: '/spiritual', icon: 'FiHeart' },
    { label: 'Admin', path: '/admin', icon: 'FiSettings' },
  ],
  Teacher: [
    { label: 'Dashboard', path: '/dashboard', icon: 'FiHome' },
    { label: 'Students', path: '/students', icon: 'FiUsers' },
    { label: 'Messages', path: '/messages', icon: 'FiMail' },
    { label: 'Discipline', path: '/discipline', icon: 'FiAlertCircle' },
    { label: 'Library', path: '/library', icon: 'FiBook' },
    { label: 'Reports', path: '/reports', icon: 'FiBarChart2' },
  ],
  Parent: [
    { label: 'Dashboard', path: '/dashboard', icon: 'FiHome' },
    { label: 'Messages', path: '/messages', icon: 'FiMail' },
  ],
};

export const API_ENDPOINTS = {
  STUDENTS: '/api/students',
  TEACHERS: '/api/teachers',
  MESSAGES: '/api/messages',
  INVENTORY: '/api/inventory',
  TRANSPORT: '/api/transport',
  LIBRARY: '/api/library',
  HOSTEL: '/api/hostel',
  HEALTH: '/api/health',
  ACCOUNTS: '/api/accounts',
  REPORTS: '/api/reports',
  EVENTS: '/api/events',
};
