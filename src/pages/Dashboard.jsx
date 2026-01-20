import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { seedData } from '../redux/slices/dataSlice';
import Card from '../components/Card';
import SmallSkeleton from '../components/SmallSkeleton';
import { FiUsers, FiBook, FiTruck, FiMessageSquare, FiBarChart2, FiShield, FiAward, FiTrendingUp, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { fetchStudents, fetchTeachers, fetchMessages, fetchReports } from '../utils/mockApi';
import { ROLES } from '../utils/constants';

// Lazy load ChartWidget (heavy Chart.js library)
const ChartWidget = React.lazy(() => import('../components/ChartWidget'));

/**
 * Admin Dashboard - Full system overview
 */
const AdminDashboard = ({ students, teachers, messages, reportsData }) => {
  const stats = [
    { icon: FiUsers, label: 'Total Students', value: students.length, color: 'gold' },
    { icon: FiUsers, label: 'Total Teachers', value: teachers.length, color: 'blue' },
    { icon: FiMessageSquare, label: 'Messages', value: messages.filter((m) => m.folder === 'inbox').length, color: 'green' },
    { icon: FiShield, label: 'System Health', value: '98%', color: 'purple' },
  ];

  const attendanceChartData = {
    labels: reportsData.attendance?.map((item) => item.month) || [],
    datasets: [
      {
        label: 'Attendance %',
        data: reportsData.attendance?.map((item) => item.percentage) || [],
        borderColor: '#D4AF37',
        backgroundColor: '#D4AF3730',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const gradesChartData = {
    labels: reportsData.grades?.map((item) => item.subject) || [],
    datasets: [
      {
        label: 'Average Score',
        data: reportsData.grades?.map((item) => item.average) || [],
        backgroundColor: ['#D4AF37', '#CDA434', '#A67C00', '#8A5C1A', '#5A3C0A'],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-lg p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gold-100">System overview and management</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gold-100 mx-auto mb-4">
                  <Icon size={28} className="text-gold-700" />
                </div>
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gold-700">{stat.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<SmallSkeleton height="320px" />}>
          <ChartWidget type="line" title="Attendance Trend" data={attendanceChartData} />
        </Suspense>
        <Suspense fallback={<SmallSkeleton height="320px" />}>
          <ChartWidget type="bar" title="Grades Distribution" data={gradesChartData} />
        </Suspense>
      </div>

      <Card title="Recent Messages">
        <div className="space-y-3">
          {messages.slice(0, 5).map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4 pb-3 border-b border-beige-200 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                <FiMessageSquare size={18} className="text-gold-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{msg.subject}</p>
                <p className="text-sm text-gray-600 truncate">{msg.body}</p>
              </div>
              {!msg.read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2" />}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/**
 * Teacher Dashboard - Class and student management
 */
const TeacherDashboard = ({ students, messages }) => {
  const myClasses = students.length; // Simplified: all students are "my class"
  const unreadMessages = messages.filter((m) => m.folder === 'inbox' && !m.read).length;

  const stats = [
    { icon: FiUsers, label: 'My Students', value: myClasses, color: 'gold' },
    { icon: FiMessageSquare, label: 'Unread Messages', value: unreadMessages, color: 'blue' },
    { icon: FiAward, label: 'Classes', value: '4', color: 'green' },
    { icon: FiBarChart2, label: 'Assignments', value: '12', color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-blue-100">Manage your classes and students</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mx-auto mb-4">
                  <Icon size={28} className="text-blue-700" />
                </div>
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-blue-700">{stat.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Class Performance">
          <p className="text-gray-600 mb-4">Average Class Grade: <span className="text-2xl font-bold text-blue-700">87%</span></p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Math</span>
              <div className="w-32 bg-gray-200 rounded h-2">
                <div className="bg-blue-500 h-2 rounded" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Science</span>
              <div className="w-32 bg-gray-200 rounded h-2">
                <div className="bg-blue-500 h-2 rounded" style={{ width: '90%' }} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">English</span>
              <div className="w-32 bg-gray-200 rounded h-2">
                <div className="bg-blue-500 h-2 rounded" style={{ width: '88%' }} />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Recent Messages">
          <div className="space-y-3">
            {messages.slice(0, 4).map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 pb-2 border-b border-beige-200 last:border-b-0"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FiMessageSquare size={14} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-600 truncate">{msg.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

/**
 * Parent Dashboard - Student progress tracking
 */
const ParentDashboard = ({ students, messages }) => {
  const childName = students.length > 0 ? `${students[0]?.firstName} ${students[0]?.lastName}` : 'Your Child';
  const unreadMessages = messages.filter((m) => m.folder === 'inbox' && !m.read).length;

  const stats = [
    { icon: FiAward, label: 'Current GPA', value: '3.8', color: 'gold' },
    { icon: FiBarChart2, label: 'Attendance', value: '94%', color: 'green' },
    { icon: FiMessageSquare, label: 'New Messages', value: unreadMessages, color: 'blue' },
    { icon: FiBook, label: 'Assignments', value: '8', color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-green-100">Track {childName}'s progress</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
                  <Icon size={28} className="text-green-700" />
                </div>
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-green-700">{stat.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Academic Performance">
          <p className="text-gray-600 mb-4">Subject Grades:</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 font-medium">Math</span>
              <span className="text-lg font-bold text-green-700">A</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 font-medium">Science</span>
              <span className="text-lg font-bold text-green-700">A+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 font-medium">English</span>
              <span className="text-lg font-bold text-green-700">A</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 font-medium">History</span>
              <span className="text-lg font-bold text-green-700">B+</span>
            </div>
          </div>
        </Card>

        <Card title="School Communications">
          <div className="space-y-3">
            {messages.slice(0, 4).map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 pb-2 border-b border-beige-200 last:border-b-0"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FiMessageSquare size={14} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-600 truncate">{msg.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

/**
 * Main Dashboard Component - Routes to role-specific dashboards
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { students, teachers, messages } = useSelector((state) => state.data);

  useEffect(() => {
    if (students.length === 0) {
      dispatch(seedData());
    }
  }, [dispatch, students.length]);

  const { data: reportsData = {} } = useQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
  });

  // Render based on user role
  if (user?.role === ROLES.ADMIN) {
    return <AdminDashboard students={students} teachers={teachers} messages={messages} reportsData={reportsData} />;
  }

  if (user?.role === ROLES.TEACHER) {
    return <TeacherDashboard students={students} messages={messages} />;
  }

  if (user?.role === ROLES.PARENT) {
    return <ParentDashboard students={students} messages={messages} />;
  }

  // Fallback to admin dashboard if role is not recognized
  return <AdminDashboard students={students} teachers={teachers} messages={messages} reportsData={reportsData} />;
};

export default React.memo(Dashboard);