const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth.js');
const { upload } = require('../config/cloudinary.js');

// Controllers
const { adminRegister, adminLogIn, getAdminDetail } = require('../controllers/admin-controller.js');
const { getCurrentUser, logout } = require('../controllers/auth-controller.js');
const { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents } = require('../controllers/class-controller.js');
const { complainCreate, complainList, complainListByStudent } = require('../controllers/complain-controller.js');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudent,
    updateStudent,
    studentAttendance,
    updateExamResult,
    updateStudentProfile,
    bulkUpdateExamResults,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance } = require('../controllers/student_controller.js');
const { subjectCreate, classSubjects, getSubjectDetail, deleteSubject, allSubjects } = require('../controllers/subject-controller.js');
const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, deleteTeacher, updateTeacherSubject, teacherAttendance } = require('../controllers/teacher-controller.js');
const { createCalendarEvent, getCalendarEvents, updateCalendarEvent, deleteCalendarEvent } = require('../controllers/calendar-controller.js');
const { createPrayerSchedule, getPrayerSchedules, updatePrayerSchedule, deletePrayerSchedule } = require('../controllers/prayer-controller.js');

// =====================
// PUBLIC ROUTES (No auth required)
// =====================

// Auth - Registration & Login
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);
router.post('/StudentReg', studentRegister);
router.post('/StudentLogin', studentLogIn);
router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn);

// Session Management
router.get('/auth/me', authenticate, getCurrentUser);
router.post('/auth/logout', logout);

// =====================
// PROTECTED ROUTES (Auth required)
// =====================

// Admin
router.get("/Admin/:id", authenticate, authorize('Admin'), getAdminDetail);

// Student
router.get("/Students/:id", authenticate, getStudents);
router.get("/Student/:id", authenticate, getStudentDetail);
router.delete("/Student/:id", authenticate, authorize('Admin'), deleteStudent);
router.put("/Student/:id", authenticate, authorize('Admin', 'Student'), updateStudent);
router.put("/StudentProfile/:id", authenticate, authorize('Admin', 'Student'), upload.single('photo'), updateStudentProfile);
router.put('/UpdateExamResult/:id', authenticate, authorize('Admin', 'Teacher'), updateExamResult);
router.post('/BulkUpdateExamResults', authenticate, authorize('Admin', 'Teacher'), bulkUpdateExamResults);
router.put('/StudentAttendance/:id', authenticate, authorize('Admin', 'Teacher'), studentAttendance);
router.put('/RemoveAllStudentsSubAtten/:id', authenticate, authorize('Admin', 'Teacher'), clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', authenticate, authorize('Admin'), clearAllStudentsAttendance);
router.put('/RemoveStudentSubAtten/:id', authenticate, authorize('Admin', 'Teacher'), removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', authenticate, authorize('Admin'), removeStudentAttendance);

// Teacher
router.get("/Teachers/:id", authenticate, getTeachers);
router.get("/Teacher/:id", authenticate, getTeacherDetail);
router.delete("/Teacher/:id", authenticate, authorize('Admin'), deleteTeacher);
router.put("/TeacherSubject", authenticate, authorize('Admin', 'Teacher'), updateTeacherSubject);
router.post('/TeacherAttendance/:id', authenticate, authorize('Admin', 'Teacher'), teacherAttendance);

// Notice
router.post('/NoticeCreate', authenticate, authorize('Admin'), noticeCreate);
router.get('/NoticeList/:id', authenticate, noticeList);
router.delete("/Notices/:id", authenticate, authorize('Admin'), deleteNotices);
router.delete("/Notice/:id", authenticate, authorize('Admin'), deleteNotice);
router.put("/Notice/:id", authenticate, authorize('Admin'), updateNotice);

// Complain
router.post('/ComplainCreate', authenticate, authorize('Student'), complainCreate);
router.get('/ComplainList/:id', authenticate, complainList);
router.get('/ComplainListByStudent/:id', authenticate, authorize('Student'), complainListByStudent);

// Sclass
router.post('/SclassCreate', authenticate, authorize('Admin'), sclassCreate);
router.get('/SclassList/:id', authenticate, sclassList);
router.get("/Sclass/:id", authenticate, getSclassDetail);
router.get("/Sclass/Students/:id", authenticate, getSclassStudents);
router.delete("/Sclasses/:id", authenticate, authorize('Admin'), deleteSclasses);
router.delete("/Sclass/:id", authenticate, authorize('Admin'), deleteSclass);

// Subject
router.post('/SubjectCreate', authenticate, authorize('Admin'), subjectCreate);
router.get('/AllSubjects/:id', authenticate, allSubjects);
router.get('/ClassSubjects/:id', authenticate, classSubjects);
router.get("/Subject/:id", authenticate, getSubjectDetail);
router.delete("/Subject/:id", authenticate, authorize('Admin'), deleteSubject);

// Academic Calendar
router.post('/CalendarCreate', authenticate, authorize('Admin'), createCalendarEvent);
router.get('/Calendar/:schoolId', authenticate, getCalendarEvents);
router.put('/Calendar/:id', authenticate, authorize('Admin'), updateCalendarEvent);
router.delete('/Calendar/:id', authenticate, authorize('Admin'), deleteCalendarEvent);

// Prayer Schedule
router.post('/PrayerCreate', authenticate, authorize('Admin'), createPrayerSchedule);
router.get('/Prayers/:schoolId', authenticate, getPrayerSchedules);
router.put('/Prayer/:id', authenticate, authorize('Admin'), updatePrayerSchedule);
router.delete('/Prayer/:id', authenticate, authorize('Admin'), deletePrayerSchedule);

module.exports = router;