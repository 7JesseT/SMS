import * as Yup from 'yup';
import { VALIDATION_MESSAGES } from './constants';

/**
 * Email validation schema
 */
export const emailSchema = Yup.string()
  .email(VALIDATION_MESSAGES.INVALID_EMAIL)
  .required(VALIDATION_MESSAGES.REQUIRED);

/**
 * Password validation schema
 */
export const passwordSchema = Yup.string()
  .min(6, VALIDATION_MESSAGES.MIN_LENGTH(6))
  .required(VALIDATION_MESSAGES.REQUIRED);

/**
 * Required field validation
 */
export const requiredField = Yup.string().required(VALIDATION_MESSAGES.REQUIRED);

/**
 * Phone number validation
 */
export const phoneSchema = Yup.string()
  .matches(/^[\d\s\-\(\)]+$/, VALIDATION_MESSAGES.INVALID_PHONE)
  .min(10, VALIDATION_MESSAGES.MIN_LENGTH(10));

/**
 * Login validation schema
 */
export const loginValidationSchema = Yup.object({
  email: emailSchema,
  password: passwordSchema,
  role: Yup.string()
    .oneOf(['Admin', 'Teacher', 'Student'], 'Invalid role')
    .required(VALIDATION_MESSAGES.REQUIRED),
});

/**
 * Student validation schema (basic info)
 */
export const studentBasicInfoSchema = Yup.object({
  name: requiredField,
  email: emailSchema,
  password: passwordSchema,
  gender: Yup.string().oneOf(['Male', 'Female', 'Other']).required(VALIDATION_MESSAGES.REQUIRED),
  dateOfBirth: Yup.date().required(VALIDATION_MESSAGES.REQUIRED),
});

/**
 * Student academic info schema
 */
export const studentAcademicInfoSchema = Yup.object({
  rollNum: requiredField,
  sclassName: requiredField,
  admissionDate: Yup.date().required(VALIDATION_MESSAGES.REQUIRED),
});

/**
 * Student contact info schema
 */
export const studentContactInfoSchema = Yup.object({
  phone: phoneSchema,
  address: Yup.string(),
  parentName: Yup.string(),
  parentPhone: phoneSchema,
});

/**
 * Teacher validation schema
 */
export const teacherValidationSchema = Yup.object({
  name: requiredField,
  email: emailSchema,
  password: passwordSchema,
  gender: Yup.string().oneOf(['Male', 'Female', 'Other']),
  dateOfBirth: Yup.date(),
  qualification: Yup.string(),
  phone: phoneSchema,
  address: Yup.string(),
});

/**
 * Class validation schema
 */
export const classValidationSchema = Yup.object({
  sclassName: requiredField,
  description: Yup.string(),
});

/**
 * Subject validation schema
 */
export const subjectValidationSchema = Yup.object({
  subName: requiredField,
  subCode: requiredField,
  sessions: Yup.number()
    .positive('Sessions must be positive')
    .required(VALIDATION_MESSAGES.REQUIRED),
  sclassName: requiredField,
  description: Yup.string(),
});

/**
 * Notice validation schema
 */
export const noticeValidationSchema = Yup.object({
  title: requiredField,
  details: requiredField.min(10, VALIDATION_MESSAGES.MIN_LENGTH(10)),
  target: Yup.string()
    .oneOf(['All', 'Admin', 'Teacher', 'Student'])
    .required(VALIDATION_MESSAGES.REQUIRED),
  date: Yup.date().required(VALIDATION_MESSAGES.REQUIRED),
});

/**
 * Complaint validation schema
 */
export const complaintValidationSchema = Yup.object({
  title: requiredField,
  complaint: requiredField.min(10, VALIDATION_MESSAGES.MIN_LENGTH(10)),
});

/**
 * Attendance validation schema
 */
export const attendanceValidationSchema = Yup.object({
  date: Yup.date().required(VALIDATION_MESSAGES.REQUIRED),
  sclassName: requiredField,
});

/**
 * Grade entry validation schema
 */
export const gradeEntryValidationSchema = Yup.object({
  examName: requiredField,
  totalMarks: Yup.number()
    .positive('Total marks must be positive')
    .required(VALIDATION_MESSAGES.REQUIRED),
  date: Yup.date().required(VALIDATION_MESSAGES.REQUIRED),
  sclassName: requiredField,
  subName: requiredField,
});
