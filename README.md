# School Management System (SMS4)

A comprehensive web-based School Management System built with React, Redux, and Tailwind CSS. Designed for managing students, classes, attendance, grades, assignments, and communications for schools.

## 🎯 Features

### **Core Modules**

#### 1. **User Management & Authentication**
- Multi-role support: Admin, Teacher, Student, Parent
- Secure login with email/password
- User registration and management
- Role-based access control (RBAC)
- Audit logging of all user actions
- Permission management by role

#### 2. **Admin Dashboard**
- Comprehensive admin interface
- User management (Create, Read, Update, Delete)
- School information settings
- Security policy configuration
- Backup and data export/import
- Audit log viewing
- Feature toggle management

#### 3. **Teacher Dashboard**
- Class management
- Student list and details
- Attendance marking
- Grade management
- Assignment creation and tracking
- Class timetable view
- Communication with parents

#### 4. **Student Dashboard**
- View class schedule
- Track assignments and submissions
- View grades and academic performance
- Check attendance record
- View timetables
- Submit assignments
- Download learning materials

#### 5. **Parent Dashboard**
- Monitor child's progress
- View grades and academic reports
- Check attendance records
- View assignments status
- Receive behavioral incident notifications
- Communicate with teachers
- Make online payments (optional)

### **Key Functionalities**

- **Attendance Management**: Mark attendance, track records, generate reports
- **Grade Management**: Manage grades, generate transcripts, track GPA
- **Assignment Tracking**: Create assignments, track submissions, provide feedback
- **Timetable Management**: Create and manage class schedules
- **Class Management**: Create classes, assign students and teachers
- **Incident Reporting**: Report behavioral incidents and track resolutions
- **Messaging**: Communication between teachers and parents
- **Data Management**: Export data, create backups, import data
- **Audit Logging**: Track all system actions for compliance
- **Reports**: Generate various reports (attendance, grades, behavior)

## 🛠️ Technology Stack

### **Frontend**
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **React Icons**: Icon library
- **React Toastify**: Notifications
- **React Query**: Data fetching (optional)

### **Backend**
- Mock API (for development)
- Can be integrated with Express.js, Django, or any REST API
- LocalStorage for data persistence

### **DevTools**
- ESLint: Code linting
- Prettier: Code formatting
- Vite plugins for optimization

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── Card.jsx         # Card wrapper component
│   ├── StatsCard.jsx    # Statistics display
│   ├── CrudModal.jsx    # Form modal for CRUD operations
│   ├── ConfirmDialog.jsx # Confirmation dialogs
│   ├── BackupManager.jsx # Backup/export functionality
│   ├── AuditTable.jsx   # Audit log display
│   ├── Navigation.jsx   # Top navigation
│   └── Sidebar.jsx      # Side navigation
├── pages/               # Page components
│   ├── Login.jsx        # Login page
│   ├── Dashboard.jsx    # Main dashboard router
│   ├── AdminSection.jsx # Admin dashboard
│   ├── TeacherDashboard.jsx  # Teacher dashboard
│   ├── StudentDashboard.jsx  # Student dashboard
│   ├── ParentDashboard.jsx   # Parent dashboard
│   └── ClassPage.jsx    # Individual class view
├── redux/               # State management
│   ├── store.js         # Redux store configuration
│   └── slices/          # Redux slices
│       ├── authSlice.js
│       ├── usersSlice.js
│       ├── classesSlice.js
│       ├── timetablesSlice.js
│       ├── attendanceSlice.js
│       ├── gradesSlice.js
│       ├── assignmentsSlice.js
│       ├── incidentsSlice.js
│       ├── messagesSlice.js
│       ├── auditSlice.js
│       ├── settingsSlice.js
│       └── parentsSlice.js
├── utils/               # Utility functions
│   ├── mockApi.js       # Mock API calls
│   ├── permissions.js   # Permission system
│   ├── validators.js    # Form validation
│   └── helpers.js       # Helper functions
├── styles/              # Global styles
│   └── globals.css      # Tailwind imports
├── App.jsx              # Main app component
├── App.css              # App styles
└── main.jsx             # Entry point
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16+)
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd sms4
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### **Build for Production**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

## 📝 Demo Credentials

The system comes with pre-populated demo users for testing:

```
Admin:
  Email: admin@hof.local
  Password: demo1234

Teacher:
  Email: teacher@hof.local
  Password: demo1234

Student:
  Email: student@hof.local
  Password: demo1234

Parent:
  Email: parent@hof.local
  Password: demo1234
```

## 🔐 Security Features

- **Role-Based Access Control (RBAC)**: Different permissions for different roles
- **Password Policies**: Configurable password requirements
- **Audit Logging**: Track all system actions
- **Data Encryption**: Support for password hashing (implement with backend)
- **Two-Factor Authentication**: Optional 2FA support
- **Session Management**: Automatic logout after inactivity
- **CORS Support**: Secure API communication
- **Input Validation**: Client-side and server-side validation

## 📊 Data Models

### **User**
```javascript
{
  id: string,
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'teacher' | 'student' | 'parent',
  permissions: string[],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### **Class**
```javascript
{
  id: string,
  name: string,
  teacher: string,
  students: string[],
  room: string,
  term: number,
  createdAt: timestamp
}
```

### **Attendance**
```javascript
{
  id: string,
  studentId: string,
  classId: string,
  date: date,
  status: 'present' | 'absent' | 'late' | 'excused',
  notes: string,
  markedBy: string,
  timestamp: timestamp
}
```

### **Grade**
```javascript
{
  id: string,
  studentId: string,
  classId: string,
  subject: string,
  exam: string,
  score: number,
  grade: string,
  remarks: string,
  recordedBy: string,
  timestamp: timestamp
}
```

### **Assignment**
```javascript
{
  id: string,
  classId: string,
  title: string,
  description: string,
  dueDate: date,
  createdBy: string,
  submissions: [{
    studentId: string,
    submittedAt: timestamp,
    status: 'submitted' | 'late' | 'missing',
    feedback: string
  }],
  createdAt: timestamp
}
```

## 🔧 Configuration

### **School Settings** (Admin Panel)
- School name and contact information
- Feature toggles (self-marking, online payments)
- Security policies (password requirements)
- Notification settings
- Report configurations

### **Environment Variables**
Create `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=School Management System
VITE_ENABLE_ANALYTICS=false
```

## 📡 API Integration

The system currently uses mock APIs. To integrate with a real backend:

1. Update `/src/utils/mockApi.js` with actual API endpoints
2. Replace mock calls with real HTTP requests (fetch/axios)
3. Implement proper error handling
4. Add authentication token management

Example API endpoints structure:
```
POST /api/auth/login
POST /api/auth/logout
POST /api/users
GET /api/users
PUT /api/users/:id
DELETE /api/users/:id
GET /api/classes
POST /api/classes
GET /api/attendance
POST /api/attendance
GET /api/grades
POST /api/grades
GET /api/assignments
POST /api/assignments
```

## 🎨 Customization

### **Colors & Theme**
Tailwind CSS colors can be customized in `tailwind.config.js`:
- Primary: Blue/Indigo (Teachers)
- Success: Green (Students)
- Warning: Orange/Yellow
- Error: Red
- Info: Purple

### **Adding New Features**
1. Create a new Redux slice in `/redux/slices/`
2. Create components in `/components/`
3. Create pages in `/pages/`
4. Update routing in `App.jsx`
5. Add mock API functions in `utils/mockApi.js`

## 📱 Responsive Design

- Mobile-first approach
- Tailwind responsive classes
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## 🐛 Troubleshooting

### **Port Already in Use**
```bash
npm run dev -- --port 5174
```

### **Dependencies Issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Build Errors**
```bash
npm run build -- --debug
```

### **LocalStorage Issues**
- Clear browser cache: Ctrl+Shift+Delete
- Clear localStorage: Open DevTools > Console > `localStorage.clear()`

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

School Management System - Built with React & Redux

## 📧 Support

For issues, questions, or suggestions, please open an issue on the repository.

## 🎓 Educational Use

This project is ideal for:
- Learning React and Redux patterns
- Understanding school management systems
- Building portfolio projects
- Teaching web development concepts
- School administration automation

## 🗺️ Future Enhancements

- [ ] Payment gateway integration
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] SMS integration
- [ ] Video conferencing
- [ ] Document management
- [ ] Parent-teacher scheduling
- [ ] Learning management system (LMS)
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Advanced search and filters

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Active Development

The app opens at `http://localhost:5173`

##  Quick Login

Use **any email and password**, select your role:
- **Admin**: `admin@hof.school` / any password
- **Teacher**: `teacher@hof.school` / any password  
- **Parent**: `parent@hof.school` / any password

##  Project Structure

```
src/
 components/       # Reusable UI components
 pages/           # Page components for routes
 redux/           # Redux slices and store
 mocks/           # Mock data (dummyData.js)
 utils/           # Utilities and API wrappers
 App.jsx          # Main app with routing
 main.jsx         # Entry point
 index.css        # Global styles
```

##  Data Management

- **LocalStorage Keys**: `hof_user`, `hof_data`
- **Auto-Seeding**: Populates on first load from dummyData.js
- **Persistence**: All changes automatically saved to localStorage
- **Admin Reset**: Admin > Reset Database to clear and reseed

##  Design Highlights

- **Color Palette**: Gold (#D4AF37), White, Beige
- **Animations**: Framer Motion with reduced-motion support
- **Accessibility**: WCAG AA target, keyboard navigation
- **Responsive**: Mobile-first, works on all screen sizes

##  Key Pages

| Page | Features |
|------|----------|
| **Dashboard** | Key metrics, charts, recent messages |
| **Students** | Searchable list, attendance %, quick actions |
| **Student Profile** | Details, grades, health, library, PDF ID card |
| **Teachers** | List with ratings, subjects, experience |
| **Messages** | Inbox/Sent/Drafts, optimistic updates, simulated replies |
| **Reports** | Attendance trends, grades, financials, teacher ratings |
| **Inventory** | Items by category, low stock alerts |
| **Admin** | Export/Import data, Reset database |

##  Tech Stack

- React 18 + Vite
- Redux Toolkit + React Query
- Tailwind CSS
- Framer Motion
- Chart.js
- react-table
- react-hook-form
- @react-pdf/renderer

##  npm Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

##  Role-Based Access

| Feature | Admin | Teacher | Parent |
|---------|:-----:|:-------:|:------:|
| Dashboard |  |  |  |
| Students |  |  |  |
| Teachers |  |  |  |
| Messages |  |  |  |
| Transport |  |  |  |
| Inventory |  |  |  |
| Reports |  |  |  |
| Admin Panel |  |  |  |

##  Mock Data Included

- 25 Students with grades, attendance, health info
- 15 Teachers with ratings and subjects
- 60+ Messages across folders
- 50+ Inventory items by category
- 8 Buses with routes
- 30 Library books
- 60 Health records
- Financial data for 12 months

##  Features

 Optimistic message updates
 Simulated message replies (3-8s delay, 30% chance)
 Toast notifications (success/error)
 PDF export (Student ID, Reports)
 Data import/export as JSON
 Database reset functionality
 Search and filtering
 Sorting and pagination
 Form validation (react-hook-form + yup)
 Chart visualizations

##  Error Handling

- Mock API simulates 10% error rate for testing
- User-friendly error messages
- Retry functionality
- Toast notifications

##  License

Educational and demonstration purposes.

---

**The Heart of Our Father School Manager v1.0.0**
Built with React, Vite, Redux Toolkit, React Query, Tailwind CSS
