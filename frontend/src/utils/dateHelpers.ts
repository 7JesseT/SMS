import { format, parseISO } from 'date-fns';
import { DATE_FORMAT, DATE_TIME_FORMAT, DATE_INPUT_FORMAT } from './constants';

/**
 * Format a date string or Date object to a readable format
 */
export const formatDate = (date: string | Date, formatString: string = DATE_FORMAT): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format a date with time
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, DATE_TIME_FORMAT);
};

/**
 * Format a date for input fields (YYYY-MM-DD)
 */
export const formatInputDate = (date: string | Date): string => {
  return formatDate(date, DATE_INPUT_FORMAT);
};

/**
 * Get current date in ISO format
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString();
};

/**
 * Get current date in input format
 */
export const getTodayInputDate = (): string => {
  return formatInputDate(new Date());
};

/**
 * Check if a date is today
 */
export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string | Date): number => {
  const dob = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Get relative time (e.g., "2 days ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = typeof date === 'string' ? parseISO(date) : date;
  const diffInMs = now.getTime() - then.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};
