# School Management System (SMS)

A comprehensive school management platform built to streamline administrative tasks, student management, teacher coordination, and academic tracking. This full-stack application provides role-based dashboards for administrators, teachers, and students with real-time data synchronization.

## 📋 Overview

The School Management System offers a complete solution for educational institutions to manage:

- **Student Management**: Enrollment, attendance tracking, grade management, and academic records
- **Teacher Management**: Subject assignments, class scheduling, and performance tracking
- **Administrative Dashboard**: Complete oversight of classes, subjects, notices, and complaints
- **Attendance System**: Real-time attendance marking and reporting
- **Grades & Academics**: Comprehensive grade tracking and academic performance analytics
- **Notice Board**: Centralized communication system for announcements
- **Complaint Management**: Student feedback and issue resolution system

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Material-UI v7** for modern, responsive UI components
- **React Router** for navigation
- **React Hook Form** with Yup validation
- **TanStack Query** for efficient data fetching
- **Axios** for API communication
- **Vite** as build tool

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests
- **dotenv** for environment configuration

## 📁 Project Structure

```
SMS/
├── backend/              # Node.js/Express API server
│   ├── controllers/      # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── index.js         # Server entry point
│
└── frontend/            # React application
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── services/    # API service layer
    │   ├── context/     # React context providers
    │   ├── hooks/       # Custom React hooks
    │   ├── types/       # TypeScript definitions
    │   └── utils/       # Helper functions
    └── public/          # Static assets
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Git**

### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=10000
   MONGO_URI=your_mongodb_connection_string
   ```

   Replace `your_mongodb_connection_string` with your actual MongoDB connection string. For MongoDB Atlas, it looks like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/school_management?retryWrites=true&w=majority
   ```

4. **Start the backend server**
   
   For development (with auto-reload):
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

   The server will start at `http://localhost:10000`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   The API base URL is configured in `src/services/api.ts`. By default, it points to:
   - **Production**: `https://sms-15wv.onrender.com`
   - For local development, update it to: `http://localhost:10000`

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

   Production files will be generated in the `dist` directory.

## 🔐 User Roles & Access

The system supports three user roles:

### 1. Administrator
- Complete system access
- Manage classes, subjects, and teachers
- View and manage all students
- Handle complaints and notices
- System-wide analytics

### 2. Teacher
- View assigned classes and subjects
- Mark student attendance
- Submit and manage grades
- View student performance
- Post notices to students

### 3. Student
- View personal dashboard
- Check attendance records
- View grades and academic performance
- Submit complaints
- Read notices and announcements

## 🌐 Deployment

### Backend Deployment (Render)

The backend is currently deployed on Render at `https://sms-15wv.onrender.com`

To deploy your own instance:

1. Create a new Web Service on Render
2. Connect your repository
3. Configure environment variables (MONGO_URI, PORT)
4. Deploy from the `backend` directory
5. Use build command: `npm install`
6. Use start command: `npm start`

### Frontend Deployment

The frontend can be deployed to platforms like:
- **Vercel** (recommended for Vite apps)
- **Netlify**
- **Render** (static site)

Deployment steps (example for Vercel):
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory
3. Run: `vercel --prod`
4. Follow the prompts

## 🔧 Development Guidelines

### Running Both Servers Simultaneously

For development, you'll typically run both frontend and backend:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### API Testing

The backend exposes RESTful endpoints. You can test them using tools like:
- **Postman**
- **Thunder Client** (VS Code extension)
- **curl** commands

### Code Quality

Before committing changes:

```bash
# Frontend - Check for linting issues
cd frontend
npm run lint

# Frontend - Build check
npm run build
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Verify MongoDB connection string is correct
- Ensure MongoDB Atlas allows connections from your IP
- Check if port 10000 is already in use

**Frontend build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear TypeScript cache: `rm -rf tsconfig.tsbuildinfo`
- Update dependencies: `npm update`

**CORS errors:**
- Ensure backend CORS is configured to accept frontend origin
- Check if API URL in frontend matches backend URL

**MongoDB connection issues:**
- Verify network access in MongoDB Atlas
- Check database user permissions
- Ensure connection string includes database name

## 📞 Support

For technical issues or questions about the codebase, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: January 2026
