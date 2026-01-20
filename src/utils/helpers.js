// Helper utility functions

/**
 * Format date to readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = '₦') => {
  return `${currency} ${amount?.toLocaleString() || '0'}`;
};

/**
 * Format percentage
 */
export const formatPercentage = (value) => {
  return `${Math.round(value)}%`;
};

/**
 * Get initials from name
 */
export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

/**
 * Get initials from full name
 */
export const getInitialsFromName = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.map((p) => p.charAt(0)).join('').toUpperCase();
};

/**
 * Truncate text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Check if user has permission
 */
export const hasPermission = (userRole, requiredRoles) => {
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  return requiredRoles.includes(userRole);
};

/**
 * Generate random ID
 */
export const generateId = (prefix = 'ID') => {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Sort array of objects
 */
export const sortByProperty = (array, property, ascending = true) => {
  return [...array].sort((a, b) => {
    if (ascending) {
      return a[property] > b[property] ? 1 : -1;
    }
    return a[property] < b[property] ? 1 : -1;
  });
};

/**
 * Filter array by property
 */
export const filterByProperty = (array, property, value) => {
  return array.filter((item) => item[property] === value);
};

/**
 * Get color by status
 */
export const getStatusColor = (status) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    maintenance: 'bg-orange-100 text-orange-800',
    completed: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };
  return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Convert to CSV
 */
export const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map((row) => headers.map((h) => row[h]).join(','))];
  return csv.join('\n');
};

/**
 * Download file
 */
export const downloadFile = (content, filename, type = 'text/plain') => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
/**
 * Delay execution
 */
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  const csv = convertToCSV(data);
  downloadFile(csv, filename, 'text/csv');
};