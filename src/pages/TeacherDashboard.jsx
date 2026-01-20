import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiUsers, FiBarChart2, FiCheckCircle, FiCalendar, FiBriefcase } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import StatsCard from '../components/StatsCard';
import { getTimetables } from '../redux/slices/timetablesSlice';
import { getClasses } from '../redux/slices/classesSlice';
import { getAssignments } from '../redux/slices/assignmentsSlice';
import { getAttendance } from '../redux/slices/attendanceSlice';

/**
 * TeacherDashboard - Main dashboard for teachers
 * Shows classes, timetable, assignments, and attendance tracking
 */
const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const { items: classes } = useSelector((state) => state.classes || { items: [] });
  const { items: timetables } = useSelector((state) => state.timetables || { items: [] });
  const { items: assignments } = useSelector((state) => state.assignments || { items: [] });
  const { items: attendance } = useSelector((state) => state.attendance || { items: [] });

  const [selectedClass, setSelectedClass] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // overview, class, assignments, attendance

  // Load data on mount
  useEffect(() => {
    dispatch(getTimetables());
    dispatch(getClasses());
    dispatch(getAssignments());
    dispatch(getAttendance());
  }, [dispatch]);

  // Set default selected class
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]);
    }
  }, [classes, selectedClass]);

  // Calculate statistics
  const statsData = {
    totalClasses: classes.length,
    totalStudents: classes.reduce((sum, c) => sum + (c.students?.length || 0), 0),
    pendingAssignments: assignments.filter((a) => !a.submitted).length,
    attendanceRate: attendance.length > 0
      ? Math.round((attendance.filter((a) => a.status === 'present').length / attendance.length) * 100)
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-blue-100">Manage your classes, assignments, and student progress</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<FiBook size={24} />}
          label="Classes"
          value={statsData.totalClasses}
          color="blue"
        />
        <StatsCard
          icon={<FiUsers size={24} />}
          label="Students"
          value={statsData.totalStudents}
          color="green"
        />
        <StatsCard
          icon={<FiBriefcase size={24} />}
          label="Assignments"
          value={statsData.pendingAssignments}
          color="orange"
        />
        <StatsCard
          icon={<FiBarChart2 size={24} />}
          label="Attendance Rate"
          value={`${statsData.attendanceRate}%`}
          color="purple"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-beige-300 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: FiBarChart2 },
          { id: 'classes', label: 'My Classes', icon: FiBook },
          { id: 'assignments', label: 'Assignments', icon: FiBriefcase },
          { id: 'attendance', label: 'Attendance', icon: FiCheckCircle },
          { id: 'timetable', label: 'Timetable', icon: FiCalendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition ${
                viewMode === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card title="Today's Schedule">
            {timetables.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No classes scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {timetables.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.className}</h4>
                      <p className="text-sm text-gray-600">{item.time}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-200 text-blue-700 rounded text-xs font-semibold">
                      {item.room}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Assignments */}
          <Card title="Recent Assignments">
            {assignments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No assignments yet</p>
            ) : (
              <div className="space-y-3">
                {assignments.slice(0, 5).map((assign) => (
                  <div key={assign.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <div>
                      <h4 className="font-semibold text-gray-800">{assign.title}</h4>
                      <p className="text-sm text-gray-600">Due: {assign.dueDate}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      assign.submitted ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                    }`}>
                      {assign.submitted ? 'Submitted' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* CLASSES TAB */}
      {viewMode === 'classes' && (
        <Card title="My Classes">
          {classes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No classes assigned</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <motion.div
                  key={cls.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/class/${cls.id}`)}
                  className="p-4 border border-beige-300 rounded-lg hover:shadow-lg cursor-pointer transition"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{cls.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">{cls.students?.length || 0}</span> students
                  </p>
                  <p className="text-sm text-gray-600 mb-3">Teacher: {cls.teacher}</p>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                    View Class
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ASSIGNMENTS TAB */}
      {viewMode === 'assignments' && (
        <Card title="Assignment Management">
          {assignments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No assignments yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-beige-300">
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Class</th>
                    <th className="text-left py-3 px-4 font-semibold">Due Date</th>
                    <th className="text-center py-3 px-4 font-semibold">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assign) => (
                    <tr key={assign.id} className="border-b border-beige-100 hover:bg-beige-50">
                      <td className="py-3 px-4 font-medium">{assign.title}</td>
                      <td className="py-3 px-4 text-gray-600">{assign.className}</td>
                      <td className="py-3 px-4 text-gray-600">{assign.dueDate}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          assign.submitted ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                        }`}>
                          {assign.submitted ? assign.submittedCount || 0 : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* ATTENDANCE TAB */}
      {viewMode === 'attendance' && (
        <Card title="Attendance Tracking">
          {attendance.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No attendance records</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-300">
                <p className="text-sm text-gray-600 font-semibold mb-1">Present</p>
                <p className="text-2xl font-bold text-green-700">
                  {attendance.filter((a) => a.status === 'present').length}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-300">
                <p className="text-sm text-gray-600 font-semibold mb-1">Absent</p>
                <p className="text-2xl font-bold text-red-700">
                  {attendance.filter((a) => a.status === 'absent').length}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300">
                <p className="text-sm text-gray-600 font-semibold mb-1">Late</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {attendance.filter((a) => a.status === 'late').length}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-300">
                <p className="text-sm text-gray-600 font-semibold mb-1">Excused</p>
                <p className="text-2xl font-bold text-purple-700">
                  {attendance.filter((a) => a.status === 'excused').length}
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* TIMETABLE TAB */}
      {viewMode === 'timetable' && (
        <Card title="Weekly Timetable">
          {timetables.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No timetable available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-beige-300">
                    <th className="text-left py-3 px-4 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-semibold">Class</th>
                    <th className="text-left py-3 px-4 font-semibold">Room</th>
                    <th className="text-left py-3 px-4 font-semibold">Day</th>
                  </tr>
                </thead>
                <tbody>
                  {timetables.map((item) => (
                    <tr key={item.id} className="border-b border-beige-100 hover:bg-beige-50">
                      <td className="py-3 px-4 font-medium">{item.time}</td>
                      <td className="py-3 px-4 text-gray-600">{item.className}</td>
                      <td className="py-3 px-4 text-gray-600">{item.room}</td>
                      <td className="py-3 px-4 text-gray-600">{item.day}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default React.memo(TeacherDashboard);
