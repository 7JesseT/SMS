# School Management System - Frontend Development Plan

**Project Type:** School Management System (SMS)  
**Tech Stack:** React 18 + TypeScript + Material UI + Vite  
**Target:** Industry-standard, production-ready application  
**Date:** January 22, 2026

---

## 1. Executive Summary

Building a comprehensive School Management System with three distinct user roles (Admin, Teacher, Student) accessible through a unified authentication system. The application will feature a professional landing page, role-based dashboards, and full CRUD operations for all entities with advanced UX patterns.

---

## 2. Design System

### 2.1 Color Palette
- **Primary:** `oklch(79.5% 0.184 86.047)` - Vibrant coral/orange
- **Secondary:** `#FFFFFF` (White)
- **Background:** `#F5F5F5` (Light gray for contrast)
- **Text Primary:** `rgba(0, 0, 0, 0.87)`
- **Text Secondary:** `rgba(0, 0, 0, 0.6)`
- **Success:** `#4CAF50`
- **Warning:** `#FF9800`
- **Error:** `#F44336`
- **Info:** `#2196F3`

### 2.2 Typography
- **Font Family:** Roboto (all weights: 300, 400, 500, 700)
- **Headings:** Roboto Medium/Bold
- **Body:** Roboto Regular
- **Captions:** Roboto Light

### 2.3 Spacing & Layout
- **Base Unit:** 8px
- **Container Max Width:** 1440px
- **Sidebar Width:** 280px (desktop), Drawer (mobile)
- **Header Height:** 64px

---

## 3. Project Architecture

### 3.1 Folder Structure
```
frontend/src/
├── main.tsx                      # Entry point
├── App.tsx                       # Root component with routing
├── index.css                     # Global styles
│
├── assets/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── logo-placeholder.svg
│
├── components/                   # Reusable components
│   ├── common/                   # Shared across all roles
│   │   ├── Layout/
│   │   │   ├── AppLayout.tsx           # Main layout with sidebar
│   │   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   │   ├── Header.tsx              # Top app bar
│   │   │   ├── Breadcrumbs.tsx         # Navigation breadcrumbs
│   │   │   └── Footer.tsx              # Footer component
│   │   ├── Navigation/
│   │   │   ├── NavItem.tsx
│   │   │   └── NavSection.tsx
│   │   ├── DataDisplay/
│   │   │   ├── DataTable.tsx           # Advanced table component
│   │   │   ├── TableToolbar.tsx        # Search, filter, bulk actions
│   │   │   ├── TablePagination.tsx
│   │   │   ├── StatusChip.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── Forms/
│   │   │   ├── FormStepper.tsx         # Multi-step form wrapper
│   │   │   ├── FormField.tsx           # Standardized form field
│   │   │   ├── DatePicker.tsx
│   │   │   ├── SearchableSelect.tsx
│   │   │   └── FileUpload.tsx
│   │   ├── Feedback/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── NotificationCenter.tsx  # Real-time notifications
│   │   │   ├── NotificationBadge.tsx
│   │   │   └── Toast.tsx               # Snackbar notifications
│   │   ├── Cards/
│   │   │   ├── StatsCard.tsx           # Dashboard statistics
│   │   │   ├── InfoCard.tsx
│   │   │   └── ActionCard.tsx
│   │   └── Modals/
│   │       ├── DetailModal.tsx
│   │       └── FormModal.tsx
│   │
│   ├── landing/                  # Landing page components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Testimonials.tsx
│   │   ├── ContactSection.tsx
│   │   └── LandingFooter.tsx
│   │
│   ├── auth/                     # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── admin/                    # Admin-specific components
│   │   ├── Dashboard/
│   │   │   ├── OverviewStats.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── Students/
│   │   │   ├── StudentList.tsx
│   │   │   ├── StudentForm.tsx         # Multi-step registration
│   │   │   ├── StudentProfile.tsx
│   │   │   ├── StudentFilters.tsx
│   │   │   └── BulkStudentActions.tsx
│   │   ├── Teachers/
│   │   │   ├── TeacherList.tsx
│   │   │   ├── TeacherForm.tsx
│   │   │   ├── TeacherProfile.tsx
│   │   │   ├── AttendanceView.tsx
│   │   │   └── AssignSubjects.tsx
│   │   ├── Classes/
│   │   │   ├── ClassList.tsx
│   │   │   ├── ClassForm.tsx
│   │   │   ├── ClassDetails.tsx
│   │   │   └── StudentAssignment.tsx
│   │   ├── Subjects/
│   │   │   ├── SubjectList.tsx
│   │   │   ├── SubjectForm.tsx
│   │   │   └── SubjectDetails.tsx
│   │   ├── Notices/
│   │   │   ├── NoticeList.tsx
│   │   │   ├── NoticeForm.tsx
│   │   │   └── NoticePreview.tsx
│   │   └── Complaints/
│   │       ├── ComplaintList.tsx
│   │       └── ComplaintDetails.tsx
│   │
│   ├── teacher/                  # Teacher-specific components
│   │   ├── Dashboard/
│   │   │   ├── MyClasses.tsx
│   │   │   ├── UpcomingSchedule.tsx
│   │   │   └── PendingTasks.tsx
│   │   ├── Attendance/
│   │   │   ├── AttendanceMarking.tsx   # Bulk attendance interface
│   │   │   ├── AttendanceHistory.tsx
│   │   │   └── AttendanceReport.tsx
│   │   ├── Grades/
│   │   │   ├── GradeEntry.tsx          # Batch grade entry
│   │   │   ├── GradeBook.tsx
│   │   │   └── ExamCreation.tsx
│   │   ├── Students/
│   │   │   ├── MyStudentsList.tsx
│   │   │   └── StudentPerformance.tsx
│   │   └── Profile/
│   │       ├── MyProfile.tsx
│   │       └── AttendanceRecord.tsx
│   │
│   └── student/                  # Student-specific components
│       ├── Dashboard/
│       │   ├── WelcomeBanner.tsx
│       │   ├── AttendanceSummary.tsx
│       │   └── GradeOverview.tsx
│       ├── Academics/
│       │   ├── MyGrades.tsx
│       │   ├── SubjectsList.tsx
│       │   └── ExamResults.tsx
│       ├── Attendance/
│       │   ├── AttendanceCalendar.tsx
│       │   └── AttendanceStats.tsx
│       ├── Notices/
│       │   └── NoticeBoard.tsx
│       ├── Complaints/
│       │   ├── MyComplaints.tsx
│       │   └── SubmitComplaint.tsx
│       └── Profile/
│           └── StudentProfile.tsx
│
├── pages/                        # Page-level components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   │
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── StudentsPage.tsx
│   │   ├── TeachersPage.tsx
│   │   ├── ClassesPage.tsx
│   │   ├── SubjectsPage.tsx
│   │   ├── NoticesPage.tsx
│   │   └── ComplaintsPage.tsx
│   │
│   ├── teacher/
│   │   ├── TeacherDashboard.tsx
│   │   ├── ClassesPage.tsx
│   │   ├── AttendancePage.tsx
│   │   ├── GradesPage.tsx
│   │   └── ProfilePage.tsx
│   │
│   └── student/
│       ├── StudentDashboard.tsx
│       ├── GradesPage.tsx
│       ├── AttendancePage.tsx
│       ├── NoticesPage.tsx
│       ├── ComplaintsPage.tsx
│       └── ProfilePage.tsx
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts               # Authentication state
│   ├── useNotifications.ts      # Real-time notifications
│   ├── useTable.ts              # Table state management
│   ├── usePagination.ts
│   ├── useSort.ts
│   ├── useFilter.ts
│   ├── useDebounce.ts
│   └── useMediaQuery.ts         # Responsive breakpoints
│
├── context/                      # React Context providers
│   ├── AuthContext.tsx
│   ├── NotificationContext.tsx
│   ├── ThemeContext.tsx
│   └── SidebarContext.tsx
│
├── services/                     # API services (dummy data for now)
│   ├── api.ts                   # Axios instance configuration
│   ├── authService.ts
│   ├── adminService.ts
│   ├── teacherService.ts
│   └── studentService.ts
│
├── utils/                        # Utility functions
│   ├── constants.ts             # App constants
│   ├── validators.ts            # Form validation
│   ├── formatters.ts            # Data formatting
│   ├── dateHelpers.ts
│   └── exportHelpers.ts         # CSV export utilities
│
├── types/                        # TypeScript type definitions
│   ├── index.ts
│   ├── auth.types.ts
│   ├── admin.types.ts
│   ├── teacher.types.ts
│   ├── student.types.ts
│   └── common.types.ts
│
├── data/                         # Dummy/mock data
│   ├── mockStudents.ts
│   ├── mockTeachers.ts
│   ├── mockClasses.ts
│   ├── mockSubjects.ts
│   ├── mockNotices.ts
│   └── mockComplaints.ts
│
├── theme/                        # MUI theme configuration
│   ├── theme.ts                 # Custom theme
│   ├── palette.ts
│   └── typography.ts
│
└── routes/                       # Routing configuration
    ├── index.tsx                # Main router
    ├── adminRoutes.tsx
    ├── teacherRoutes.tsx
    └── studentRoutes.tsx
```

---

## 4. Core Features Breakdown

### 4.1 Landing Page (Public)
**Route:** `/`

**Sections:**
1. **Hero Section**
   - School logo placeholder
   - Compelling headline
   - CTA button → "Get Started" (leads to login)
   - Background: subtle gradient with primary color

2. **Features Section**
   - Grid of 6-8 key features with icons
   - "For Administrators", "For Teachers", "For Students"
   - Each feature: Icon + Title + Short description

3. **Testimonials Section**
   - 3 testimonial cards (dummy quotes)
   - Avatar placeholders + Name + Role

4. **Contact/Info Section**
   - School address placeholder
   - Email, Phone
   - Social media icons (placeholders)

5. **Footer**
   - Copyright
   - Quick links (About, Privacy, Terms)
   - Login button

**Mobile View:** Stacked layout, hamburger menu for navigation

---

### 4.2 Login Page
**Route:** `/login`

**Features:**
- Unified login form (email + password + role selector)
- Role dropdown: Admin | Teacher | Student
- "Remember me" checkbox
- Responsive card layout
- Form validation with real-time feedback
- Loading state during authentication
- Error handling

**Post-Login Routing:**
- Admin → `/admin/dashboard`
- Teacher → `/teacher/dashboard`
- Student → `/student/dashboard`

**Note:** Must logout to switch roles (re-login required)

---

### 4.3 Admin Dashboard
**Route:** `/admin/dashboard`

**Layout:** Sidebar (always visible on desktop) + Header + Content Area

**Dashboard Overview:**
1. **Statistics Cards** (Top row)
   - Total Students (count + icon)
   - Total Teachers (count + icon)
   - Total Classes (count + icon)
   - Total Subjects (count + icon)

2. **Quick Actions** (Second row)
   - Add New Student (button)
   - Add New Teacher (button)
   - Create Notice (button)
   - View Complaints (button)

3. **Recent Activity** (Third row)
   - Latest 5 students added
   - Latest 3 notices
   - Pending complaints count

**Sidebar Navigation:**
- Dashboard (home icon)
- Students Management
- Teachers Management
- Classes Management
- Subjects Management
- Notices Management
- Complaints Management
- Profile
- Logout

---

### 4.4 Admin - Students Management
**Route:** `/admin/students`

**Features:**

**Students List View:**
- **Advanced DataTable** with:
  - Search bar (global search across name, email, roll number)
  - Filter dropdown (by class, gender, status)
  - Sort by: Name, Roll Number, Class, Date Added
  - Columns: Avatar, Name, Roll Number, Class, Gender, Email, Actions
  - Pagination (10, 25, 50, 100 per page)
  - Row selection (checkboxes)
  
- **Bulk Actions Toolbar** (appears when rows selected):
  - Delete selected students
  - Export selected to CSV
  - Assign to class

- **Action Buttons per Row:**
  - View Profile (eye icon)
  - Edit (pencil icon)
  - Delete (trash icon)

- **Top-right Action:**
  - "Add New Student" button (primary)

**Add/Edit Student Form:**
- **Multi-step wizard** (4 steps):
  1. **Personal Information**
     - Name (text)
     - Email (email)
     - Password (password - auto-generate option)
     - Gender (select)
     - Date of Birth (date picker)
     - Photo upload (optional)
  
  2. **Academic Information**
     - Roll Number (text - auto-generate option)
     - Class (searchable select)
     - Admission Date (date picker)
  
  3. **Contact Information**
     - Phone Number (text)
     - Address (textarea)
     - Parent/Guardian Name (text)
     - Parent/Guardian Phone (text)
  
  4. **Review & Submit**
     - Summary of all entered data
     - Edit buttons for each section
     - Submit button

- **Validation:** Real-time validation per field
- **Progress Indicator:** Stepper component showing current step
- **Navigation:** Back, Next, Submit buttons
- **Save Draft:** Auto-save functionality (local storage)

**Student Profile Page:**
- **Header Section:**
  - Avatar (large)
  - Name + Roll Number
  - Class badge
  - Edit Profile button
  
- **Tabs:**
  1. **Personal Info**
     - All student details in read-only cards
     - Edit button
  
  2. **Attendance**
     - Attendance percentage (circular progress)
     - Monthly breakdown table
     - Filter by month
  
  3. **Exam Results**
     - Subject-wise grades table
     - Filter by exam/term
     - Overall performance chart (simple bar chart)
  
  4. **Activity Log**
     - Recent updates to profile
     - Attendance records
     - Grade entries

**Mobile View:** 
- List view with cards instead of table
- Filters in bottom sheet
- Single-column form layout

---

### 4.5 Admin - Teachers Management
**Route:** `/admin/teachers`

**Similar structure to Students Management with adjustments:**

**Teachers List View:**
- Columns: Avatar, Name, Email, Subject(s), Classes Assigned, Attendance %, Actions
- Filters: By subject, by class
- Bulk actions: Delete, Export

**Add/Edit Teacher Form (3-step wizard):**
1. Personal Information (Name, Email, Password, Gender, DOB)
2. Professional Information (Subject specialization, Qualification)
3. Assignment (Assign classes and subjects)

**Teacher Profile Page:**
- Tabs: Personal Info, Assigned Classes/Subjects, Attendance Record, Activity Log

---

### 4.6 Admin - Classes Management
**Route:** `/admin/classes`

**Classes List View:**
- Columns: Class Name, Student Count, Teacher Assigned, Subjects Count, Actions
- Actions: View Details, Edit, Delete
- Add Class button

**Class Form (Modal):**
- Class Name (text)
- Description (textarea - optional)

**Class Details Page:**
- **Header:** Class name + student count
- **Tabs:**
  1. **Students in Class**
     - Table with enrolled students
     - Remove student button
     - Add students button (opens multi-select modal)
  
  2. **Assigned Subjects**
     - Table: Subject Name, Teacher, Actions
     - Assign new subject button
  
  3. **Class Information**
     - Edit class details

---

### 4.7 Admin - Subjects Management
**Route:** `/admin/subjects`

**Subjects List View:**
- Columns: Subject Name, Subject Code, Class(es), Teacher(s), Actions
- Add Subject button

**Subject Form (Modal):**
- Subject Name (text)
- Subject Code (text - auto-generate option)
- Description (textarea)
- Class selection (multi-select)
- Sessions/Week (number)

**Subject Details Page:**
- Subject info card
- Assigned teachers table
- Assigned classes table
- Edit/Delete actions

---

### 4.8 Admin - Notices Management
**Route:** `/admin/notices`

**Notices List View:**
- Cards layout (not table - more visual)
- Each card: Title, Date, Preview text, Target (All/Admin/Teacher/Student), Actions
- Filter: By target audience, by date range
- Sort: Newest first, Oldest first
- Add Notice button

**Notice Form (Modal/Full Page):**
- Title (text)
- Description (rich text editor - use MUI TextField multiline for now)
- Target Audience (select: All, Admin, Teacher, Student)
- Date (auto-filled, can edit)
- Submit button

**Notice Preview (Modal):**
- Full notice content
- Metadata (author, date, audience)
- Edit/Delete buttons

---

### 4.9 Admin - Complaints Management
**Route:** `/admin/complaints`

**Complaints List View:**
- Table with: Student Name, Complaint Title, Date, Status (Pending/Resolved), Actions
- Filter: By status, by date range
- Status chips with color coding

**Complaint Details (Modal):**
- Student info (name, class, roll number)
- Complaint title
- Full complaint description
- Date submitted
- Status toggle (Pending ↔ Resolved)
- Save button

---

### 4.10 Teacher Dashboard
**Route:** `/teacher/dashboard`

**Sidebar Navigation:**
- Dashboard
- My Classes
- Attendance
- Grades
- Students
- Profile
- Logout

**Dashboard Overview:**
1. **Welcome Banner**
   - "Welcome back, [Teacher Name]"
   - Current date
   
2. **Statistics Cards**
   - My Classes Count
   - Total Students (across all classes)
   - Today's Attendance Marked (Yes/No indicator)
   - Pending Grade Entries
   
3. **My Classes Section**
   - Cards for each assigned class
   - Class name, subject, student count
   - Quick action: Mark Attendance, Enter Grades
   
4. **Upcoming Schedule** (dummy)
   - Next 3 classes (Class, Subject, Time)
   
5. **Pending Tasks**
   - Attendance not marked (list of classes)
   - Grades pending entry

---

### 4.11 Teacher - My Classes
**Route:** `/teacher/classes`

**Classes List:**
- Cards view
- Each card: Class name, Subject, Student count, Actions
- Actions: View Students, Mark Attendance, Enter Grades

**Class Students View:**
- Table: Student Name, Roll Number, Attendance %, Recent Grades
- Link to student performance details

---

### 4.12 Teacher - Attendance Management
**Route:** `/teacher/attendance`

**Bulk Attendance Marking Interface:**

**Step 1: Select Class & Date**
- Class dropdown (shows only teacher's classes)
- Subject dropdown (if applicable)
- Date picker (defaults to today)
- "Load Students" button

**Step 2: Mark Attendance**
- Table with all students in class
- Columns: Avatar, Name, Roll Number, Status
- **Status column:** Toggle buttons (Present/Absent) per student
- **Quick actions:**
  - Mark All Present
  - Mark All Absent
- Submit button

**Attendance History:**
- Filter: Class, Date range
- Table: Date, Class, Present/Total, Marked By, Actions
- Actions: View details, Edit (if same day)

**Attendance Report:**
- Select class + date range
- Generate report showing:
  - Per-student attendance percentage
  - Class average
  - Export to CSV option

---

### 4.13 Teacher - Grades Management
**Route:** `/teacher/grades`

**Batch Grade Entry Interface:**

**Step 1: Select Exam Context**
- Class dropdown
- Subject dropdown (auto-filled if teacher teaches one subject)
- Exam/Test name (text input or select from predefined)
- Total marks (number)
- Date (date picker)

**Step 2: Enter Grades**
- Table with all students in class
- Columns: Roll Number, Student Name, Marks Obtained (input field)
- **Validation:** Cannot exceed total marks
- **Auto-calculate:** Percentage, Grade (A/B/C/D/F based on marks)
- Save Draft button
- Submit button

**Grade Book:**
- Select class to view all grades
- Table: Student, Subject, Exam, Marks, Grade, Date
- Filter: By exam, by subject
- Export option

**Exam Creation (Optional):**
- Create new exam/test template
- Exam name, date, total marks, subject

---

### 4.14 Teacher - Students View
**Route:** `/teacher/students`

**My Students List:**
- Shows all students from teacher's classes
- Table: Name, Roll Number, Class, Attendance %, Actions
- Filter: By class
- Search: By name or roll number

**Student Performance View (Modal):**
- Student info card
- Subject-wise performance (only teacher's subject)
- Attendance in teacher's classes
- Recent grades

---

### 4.15 Teacher - Profile
**Route:** `/teacher/profile`

**My Profile:**
- Personal information (read-only, can request admin to edit)
- Assigned subjects and classes
- My attendance record:
  - Monthly view
  - Attendance percentage
  - Marked by admin

---

### 4.16 Student Dashboard
**Route:** `/student/dashboard`

**Sidebar Navigation:**
- Dashboard
- My Grades
- My Attendance
- Notices
- Complaints
- Profile
- Logout

**Dashboard Overview:**
1. **Welcome Banner**
   - "Welcome, [Student Name]"
   - Class badge
   
2. **Summary Cards**
   - Overall Attendance % (circular progress)
   - Total Subjects
   - Latest Exam Average
   - Pending Notices Count
   
3. **Attendance Summary**
   - This month's attendance
   - Visual indicator (green/yellow/red based on %)
   
4. **Recent Grades**
   - Table: Subject, Exam, Marks, Grade
   - Shows latest 5 results
   - "View All" link
   
5. **Latest Notices**
   - 3 most recent notices for students
   - "View All" link

---

### 4.17 Student - My Grades
**Route:** `/student/grades`

**Grades View:**
- Filter: By subject, by exam/term
- Table: Subject, Exam Name, Date, Marks Obtained, Total Marks, Grade, Percentage
- Overall performance summary card (average across all subjects)

**Subject-wise Breakdown:**
- Tabs for each subject
- List of all exams/tests for that subject
- Performance trend (simple visual)

---

### 4.18 Student - My Attendance
**Route:** `/student/attendance`

**Attendance Overview:**
- Overall attendance percentage (large display)
- Monthly breakdown cards (last 6 months)

**Attendance Calendar:**
- Calendar view showing:
  - Green days: Present
  - Red days: Absent
  - Gray days: No class/holiday
- Month/Year selector

**Attendance Stats:**
- Table: Month, Total Days, Present, Absent, Percentage
- Subject-wise attendance (if tracked separately)

---

### 4.19 Student - Notices
**Route:** `/student/notices`

**Notice Board:**
- Cards layout
- Each notice card: Title, Date, Preview, "Read More" button
- Filter: All notices, Unread only
- Mark as read functionality
- Notices sorted by date (newest first)

**Notice Detail (Modal):**
- Full notice content
- Metadata (posted by, date)

---

### 4.20 Student - Complaints
**Route:** `/student/complaints`

**My Complaints:**
- Table: Complaint Title, Date Submitted, Status (Pending/Resolved), Actions
- Status chips with color
- "Submit New Complaint" button

**Submit Complaint (Modal/Form):**
- Title (text)
- Description (textarea)
- Date (auto-filled)
- Submit button

**Complaint Details:**
- View full complaint
- Status indicator
- Cannot edit after submission

---

### 4.21 Student - Profile
**Route:** `/student/profile`

**My Profile:**
- **Profile Header:**
  - Avatar
  - Name, Roll Number, Class
  
- **Information Cards:**
  - Personal Information (read-only)
  - Contact Information (read-only)
  - Academic Information (class, admission date)
  
- **Request Changes:**
  - Button to submit complaint for profile update requests

---

## 5. Technical Specifications

### 5.1 State Management
- **React Context API** for global state:
  - AuthContext (user session, role, logout)
  - NotificationContext (real-time notifications)
  - SidebarContext (sidebar open/close state)

- **Local Component State** (useState) for:
  - Form inputs
  - Modal visibility
  - Table filters/sorting/pagination

- **Custom Hooks** for reusable logic:
  - `useAuth()` - access user, logout, role
  - `useNotifications()` - fetch, mark read, count
  - `useTable()` - sorting, filtering, pagination
  - `useMediaQuery()` - responsive breakpoints

### 5.2 Routing
- **React Router v6**
- **Protected Routes:** All dashboard routes require authentication
- **Role-based routing:** Check user role and redirect if unauthorized
- **404 Page:** For undefined routes

**Route Structure:**
```
/                          → Landing Page
/login                     → Login Page
/admin/dashboard           → Admin Dashboard
/admin/students            → Students Management
/admin/teachers            → Teachers Management
/admin/classes             → Classes Management
/admin/subjects            → Subjects Management
/admin/notices             → Notices Management
/admin/complaints          → Complaints Management
/teacher/dashboard         → Teacher Dashboard
/teacher/classes           → My Classes
/teacher/attendance        → Attendance Management
/teacher/grades            → Grades Management
/teacher/students          → My Students
/teacher/profile           → Teacher Profile
/student/dashboard         → Student Dashboard
/student/grades            → My Grades
/student/attendance        → My Attendance
/student/notices           → Notice Board
/student/complaints        → My Complaints
/student/profile           → Student Profile
*                          → 404 Not Found
```

### 5.3 Material UI Configuration

**Theme Setup:**
```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: 'oklch(79.5% 0.184 86.047)', // Convert to RGB/HEX
    },
    secondary: {
      main: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontWeight: 500 },
    h2: { fontWeight: 500 },
    h3: { fontWeight: 500 },
    button: { textTransform: 'none' },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
```

### 5.4 Responsive Breakpoints
- **xs:** 0px - 599px (Mobile)
- **sm:** 600px - 959px (Tablet)
- **md:** 960px - 1279px (Small desktop)
- **lg:** 1280px - 1919px (Desktop)
- **xl:** 1920px+ (Large desktop)

**Mobile Adaptations:**
- Sidebar → Drawer (swipe/toggle)
- Tables → Card list view
- Multi-column layouts → Single column
- Reduced padding/spacing
- Larger touch targets (min 48px)
- Limited feature visibility (hide advanced filters in collapsed state)

### 5.5 Data Handling (Dummy Data Phase)

**Mock Data Requirements:**
- 50+ dummy students (varied classes, genders, grades)
- 15+ dummy teachers (varied subjects)
- 10 classes (Grade 1-10)
- 20+ subjects (Math, English, Science, etc.)
- 20+ notices (varied dates, audiences)
- 15+ complaints (varied statuses)

**Dummy Data Storage:**
- TypeScript files in `/data` folder
- Export arrays of objects
- Use realistic names (faker.js optional)
- Consistent IDs (for relationships)

**Services Layer:**
- Create async functions that return dummy data (simulate API delay)
- Implement CRUD operations in-memory (state updates)
- Use setTimeout to simulate network latency (300-500ms)

**Example:**
```typescript
// services/adminService.ts
export const getStudents = async (): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockStudents), 400);
  });
};

export const createStudent = async (student: StudentInput): Promise<Student> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newStudent = { ...student, id: generateId() };
      mockStudents.push(newStudent);
      resolve(newStudent);
    }, 400);
  });
};
```

### 5.6 Form Validation
- **Yup** for schema validation (or Zod)
- **React Hook Form** for form state management
- Real-time validation on blur/change
- Error messages below each field
- Disabled submit button until valid

### 5.7 Notifications System (Real-time Simulation)
- **NotificationContext** manages notifications
- **Polling mechanism** (since using dummy data):
  - Check for new notices every 30 seconds
  - Check for complaint updates every 60 seconds
- **Notification Center** (bell icon in header):
  - Badge with unread count
  - Dropdown menu with recent notifications
  - "Mark all as read" option
  - Click notification → navigate to relevant page
- **Toast notifications** for:
  - Successful actions (create, update, delete)
  - Error messages
  - Real-time updates

### 5.8 Accessibility (A11y)
- Semantic HTML elements
- ARIA labels for icons/buttons
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG AA)
- Alt text for images
- Form labels properly associated

### 5.9 Performance Optimizations
- **Code Splitting:** React.lazy for route-based splitting
- **Memoization:** React.memo for expensive components
- **Debouncing:** Search inputs (300ms)
- **Virtual Scrolling:** For very long tables (react-window if needed)
- **Image Optimization:** Lazy loading, compressed placeholders

---

## 6. Development Phases

### Phase 1: Project Setup & Foundation (Days 1-2)
1. ✅ Initialize Vite + React + TypeScript project (already done)
2. Install dependencies:
   - Material UI (`@mui/material`, `@emotion/react`, `@emotion/styled`)
   - React Router (`react-router-dom`)
   - Form handling (`react-hook-form`, `yup`)
   - Icons (`@mui/icons-material`)
   - Date handling (`date-fns`)
   - Utilities (`clsx`, `uuid`)
3. Configure MUI theme (custom colors, typography)
4. Set up folder structure
5. Create TypeScript types/interfaces for all entities
6. Generate comprehensive dummy data

### Phase 2: Core Infrastructure (Days 3-4)
1. Create AuthContext and authentication flow
2. Build layout components (AppLayout, Sidebar, Header, Breadcrumbs)
3. Set up routing structure with protected routes
4. Create common components:
   - DataTable with sorting, filtering, pagination
   - FormField, FormStepper
   - LoadingSpinner, ConfirmDialog, Toast
   - StatsCard, InfoCard
5. Implement useTable, useAuth, useMediaQuery hooks
6. Set up NotificationContext

### Phase 3: Landing & Authentication (Days 5-6)
1. Build Landing Page (Hero, Features, Testimonials, Contact, Footer)
2. Create LoginForm component with validation
3. Implement logout functionality
4. Add responsive mobile navigation for landing page
5. Create 404 Not Found page

### Phase 4: Admin Module (Days 7-14)
1. **Dashboard** (Day 7):
   - Stats cards
   - Quick actions
   - Recent activity

2. **Students Management** (Days 8-9):
   - List view with advanced table
   - Multi-step registration form
   - Profile page with tabs
   - Bulk actions

3. **Teachers Management** (Day 10):
   - List view
   - Teacher form
   - Profile page

4. **Classes & Subjects** (Day 11):
   - Classes list and form
   - Class details page
   - Subjects list and form
   - Subject details

5. **Notices Management** (Day 12):
   - Notices list (cards)
   - Create/edit notice
   - Preview modal

6. **Complaints Management** (Day 13):
   - Complaints list
   - Details modal with status toggle

7. **Polish & Mobile Responsive** (Day 14):
   - Test all admin pages on mobile
   - Fix responsive issues
   - Add loading states

### Phase 5: Teacher Module (Days 15-19)
1. **Dashboard** (Day 15):
   - Welcome banner
   - Stats cards
   - My classes section
   - Upcoming schedule
   - Pending tasks

2. **My Classes** (Day 16):
   - Classes list
   - Class students view

3. **Attendance Management** (Day 17):
   - Bulk attendance marking interface
   - Attendance history
   - Attendance report

4. **Grades Management** (Day 18):
   - Batch grade entry
   - Grade book
   - Exam creation

5. **Students & Profile** (Day 19):
   - My students list
   - Student performance view
   - Teacher profile page
   - Mobile responsive testing

### Phase 6: Student Module (Days 20-23)
1. **Dashboard** (Day 20):
   - Welcome banner
   - Summary cards
   - Attendance summary
   - Recent grades
   - Latest notices

2. **Grades & Attendance** (Day 21):
   - My grades view with filters
   - Subject-wise breakdown
   - Attendance overview
   - Attendance calendar
   - Attendance stats

3. **Notices & Complaints** (Day 22):
   - Notice board
   - Submit complaint
   - My complaints list

4. **Profile & Polish** (Day 23):
   - Student profile page
   - Mobile responsive testing
   - Cross-browser testing

### Phase 7: Notifications & Real-time Features (Days 24-25)
1. Implement notification polling mechanism
2. Build NotificationCenter component
3. Add notification badges
4. Integrate toast notifications for all actions
5. Test real-time updates across all roles

### Phase 8: Polish & QA (Days 26-30)
1. **Visual Polish:**
   - Consistent spacing and alignment
   - Animation/transitions for modals, toasts
   - Loading states for all async operations
   - Empty states for tables with no data
   - Error boundaries

2. **Testing:**
   - Test all CRUD operations
   - Test all forms (validation, submission)
   - Test navigation (breadcrumbs, sidebar)
   - Test responsive layouts (all breakpoints)
   - Test accessibility (keyboard nav, screen readers)

3. **Code Quality:**
   - Remove console.logs
   - Add JSDoc comments for complex functions
   - Ensure consistent code formatting (Prettier)
   - ESLint cleanup

4. **Documentation:**
   - Component usage documentation
   - Dummy data structure documentation
   - Setup instructions (README)

5. **Performance:**
   - Check bundle size
   - Optimize images
   - Test load times
   - Add performance monitoring

---

## 7. Key Development Principles

### 7.1 Code Quality Standards
- **TypeScript:** Strict mode enabled, no `any` types
- **Component Structure:** Functional components with hooks
- **Props Validation:** TypeScript interfaces for all props
- **File Naming:** PascalCase for components, camelCase for utilities
- **Import Organization:** Third-party → Local components → Utils → Types

### 7.2 Commit Strategy
- Meaningful commit messages (conventional commits)
- One feature per commit
- Regular commits (don't bundle too many changes)

### 7.3 Component Design Patterns
- **Composition over configuration:** Build small, reusable components
- **Single Responsibility:** Each component has one clear purpose
- **Props drilling mitigation:** Use context for deeply nested props
- **Controlled components:** Forms managed by React state
- **Error boundaries:** Catch errors gracefully

### 7.4 UX Best Practices
- **Loading States:** Show spinners during async operations
- **Optimistic Updates:** Update UI immediately, rollback on error
- **Confirmation Dialogs:** For destructive actions (delete)
- **Success Feedback:** Toast messages for completed actions
- **Error Handling:** User-friendly error messages
- **Empty States:** Helpful messages when no data exists
- **Tooltips:** For icons without labels
- **Progress Indicators:** For multi-step forms

---

## 8. Dependencies

### 8.1 Core Dependencies
```json
{
  "@mui/material": "^5.15.0",
  "@mui/icons-material": "^5.15.0",
  "@emotion/react": "^11.11.0",
  "@emotion/styled": "^11.11.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "react-hook-form": "^7.49.0",
  "yup": "^1.3.3",
  "date-fns": "^3.0.0",
  "uuid": "^9.0.1",
  "clsx": "^2.1.0"
}
```

### 8.2 Dev Dependencies
```json
{
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "@types/uuid": "^9.0.7",
  "@typescript-eslint/eslint-plugin": "^6.19.0",
  "@typescript-eslint/parser": "^6.19.0",
  "eslint": "^8.56.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.4.5",
  "typescript": "^5.3.0",
  "vite": "^5.0.0"
}
```

---

## 9. File Naming Conventions

- **Components:** `ComponentName.tsx` (PascalCase)
- **Pages:** `PageName.tsx` (PascalCase)
- **Hooks:** `useHookName.ts` (camelCase with 'use' prefix)
- **Utils:** `utilityName.ts` (camelCase)
- **Types:** `typeName.types.ts` (camelCase with .types suffix)
- **Services:** `serviceName.ts` (camelCase)
- **Data:** `mockEntityName.ts` (camelCase with 'mock' prefix)
- **Constants:** `CONSTANT_NAME` (UPPER_SNAKE_CASE in file)

---

## 10. Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/feature-name` - Feature branches
- `bugfix/bug-description` - Bug fix branches

### Commit Message Format
```
type(scope): subject

body (optional)
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
- `feat(admin): add student registration multi-step form`
- `fix(teacher): correct attendance marking validation`
- `style(landing): adjust hero section responsive layout`

---

## 11. Testing Strategy (Future)

While not part of initial implementation, plan for:
- **Unit Tests:** Utility functions, custom hooks
- **Component Tests:** React Testing Library
- **E2E Tests:** Playwright/Cypress
- **Visual Regression:** Chromatic/Percy

---

## 12. Deployment Preparation

### Build Optimization
- Production build: `npm run build`
- Bundle analysis: Check for large dependencies
- Environment variables: `.env` setup
- Static asset optimization

### Checklist Before Deployment
- [ ] All console.logs removed
- [ ] No TypeScript errors
- [ ] ESLint warnings resolved
- [ ] All features tested manually
- [ ] Responsive design verified
- [ ] Performance audited (Lighthouse)
- [ ] SEO meta tags added
- [ ] Favicon and manifest configured

---

## 13. Future Integration Notes

When integrating with real backend:
1. Replace dummy services with actual API calls
2. Add axios/fetch configuration
3. Implement proper error handling
4. Add request/response interceptors
5. Handle authentication tokens (JWT)
6. Implement WebSocket for real-time notifications
7. Add retry logic for failed requests
8. Implement optimistic updates with rollback
9. Add request caching where appropriate
10. Handle file uploads properly

---

## 14. Success Metrics

### Code Quality
- TypeScript coverage: 100% (no `any`)
- Component reusability: 80%+ components reused
- Bundle size: < 500KB (gzipped)

### Performance
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

### User Experience
- All features accessible via keyboard
- Mobile-friendly (all pages tested on mobile)
- Loading states for all async operations
- Consistent design across all pages

---

## 15. Risk Mitigation

### Potential Challenges
1. **Complex State Management:** Mitigated by using Context API strategically
2. **Performance with Large Tables:** Use pagination, virtual scrolling if needed
3. **Responsive Design Complexity:** Mobile-first approach, test incrementally
4. **Form Validation Complexity:** Use yup schemas, test thoroughly
5. **Real-time Notifications:** Polling approach (acceptable for dummy data phase)

---

## 16. Timeline Summary

**Estimated Time:** 30 working days (6 weeks)

- **Week 1:** Setup, Infrastructure, Landing & Auth
- **Week 2-3:** Admin Module
- **Week 4:** Teacher Module
- **Week 5:** Student Module
- **Week 6:** Notifications, Polish, QA

---

## 17. Notes

- All dummy data will be replaced with real API integration in Phase 2 of the project
- Focus on building reusable components early to speed up later development
- Prioritize mobile responsiveness from the start (easier than retrofitting)
- Keep accessibility in mind throughout development
- Regular testing on actual devices (not just browser DevTools)
- Maintain this plan document as the single source of truth for the project

---

**Next Steps:**
1. ✅ Get client approval on this plan
2. Begin Phase 1: Project Setup & Foundation
3. Daily progress updates
4. Weekly demos of completed features

---

*End of Plan*
