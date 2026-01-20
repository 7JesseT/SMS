import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiBarChart2, FiBook, FiBriefcase, FiCheckCircle, FiCalendar, FiAward } from 'react-icons/fi';
import Card from '../components/Card';
import StatsCard from '../components/StatsCard';
import { getAssignments } from '../redux/slices/assignmentsSlice';
import { getTimetables } from '../redux/slices/timetablesSlice';
import { getAttendance } from '../redux/slices/attendanceSlice';
import { getGrades } from '../redux/slices/gradesSlice';

/**
 * StudentDashboard - Main dashboard for students
 * Shows class schedule, assignments, grades, and attendance
 */
const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const { items: assignments } = useSelector((state) => state.assignments || { items: [] });
  const { items: timetables } = useSelector((state) => state.timetables || { items: [] });
  const { items: attendance } = useSelector((state) => state.attendance || { items: [] });
  const { items: grades } = useSelector((state) => state.grades || { items: [] });

  const [viewMode, setViewMode] = useState('overview');

  // Load data on mount
  useEffect(() => {
    dispatch(getAssignments());
    dispatch(getTimetables());
    dispatch(getAttendance());
    dispatch(getGrades());
  }, [dispatch]);

  // Calculate statistics
  const statsData = {
    pendingAssignments: assignments.filter((a) => !a.submitted).length,
    completedAssignments: assignments.filter((a) => a.submitted).length,
    averageGrade: grades.length > 0
      ? Math.round(grades.reduce((sum, g) => sum + g.score, 0) / grades.length)
      : 0,
    attendanceRate: attendance.filter((a) => a.status === 'present').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-green-100">Track your assignments, grades, and attendance</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<FiBriefcase size={24} />}
          label="Pending Assignments"
          value={statsData.pendingAssignments}
          color="orange"
        />
        <StatsCard
          icon={<FiCheckCircle size={24} />}
          label="Completed"
          value={statsData.completedAssignments}
          color="green"
        />
        <StatsCard
          icon={<FiAward size={24} />}
          label="Average Grade"
          value={statsData.averageGrade}
          color="purple"
          unit="%"
        />
        <StatsCard
          icon={<FiCheckCircle size={24} />}
          label="Days Present"
          value={statsData.attendanceRate}
          color="blue"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-beige-300 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: FiBarChart2 },
          { id: 'assignments', label: 'Assignments', icon: FiBriefcase },
          { id: 'grades', label: 'Grades', icon: FiAward },
          { id: 'schedule', label: 'Schedule', icon: FiCalendar },
          { id: 'attendance', label: 'Attendance', icon: FiCheckCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition ${
                viewMode === tab.id
                  ? 'border-green-500 text-green-600'
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
          {/* Upcoming Assignments */}
          <Card title="Upcoming Assignments">
            {assignments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No assignments</p>
            ) : (
              <div className="space-y-3">
                {assignments.slice(0, 5).map((assign) => (
                  <div key={assign.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <div>
                      <h4 className="font-semibold text-gray-800">{assign.title}</h4>
                      <p className="text-sm text-gray-600">{assign.subject}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                      assign.submitted ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                    }`}>
                      {assign.submitted ? 'Done' : 'Due'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Today's Schedule */}
          <Card title="Today's Classes">
            {timetables.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No classes today</p>
            ) : (
              <div className="space-y-3">
                {timetables.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.subject || item.className}</h4>
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
        </div>
      )}

      {/* ASSIGNMENTS TAB */}
      {viewMode === 'assignments' && (
        <Card title="My Assignments">
          {assignments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No assignments</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-beige-300">
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold">Due Date</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assign) => (
                    <tr key={assign.id} className="border-b border-beige-100 hover:bg-beige-50">
                      <td className="py-3 px-4 font-medium">{assign.title}</td>
                      <td className="py-3 px-4 text-gray-600">{assign.subject}</td>
                      <td className="py-3 px-4 text-gray-600">{assign.dueDate}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          assign.submitted ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                        }`}>
                          {assign.submitted ? 'Submitted' : 'Pending'}
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

      {/* GRADES TAB */}
      {viewMode === 'grades' && (
        <Card title="My Grades">
          {grades.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No grades available</p>
          ) : (
            <div className="space-y-3">
              {grades.map((grade) => (
                <div key={grade.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-300">
                  <div>
                    <h4 className="font-semibold text-gray-800">{grade.subject}</h4>
                    <p className="text-sm text-gray-600">{grade.exam}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-700">{grade.score}%</p>
                    <p className="text-xs text-gray-600">{grade.grade}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* SCHEDULE TAB */}
      {viewMode === 'schedule' && (
        <Card title="Class Schedule">
          {timetables.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No schedule available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-beige-300">
                    <th className="text-left py-3 px-4 font-semibold">Day</th>
                    <th className="text-left py-3 px-4 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-semibold">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold">Room</th>
                    <th className="text-left py-3 px-4 font-semibold">Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {timetables.map((item) => (
                    <tr key={item.id} className="border-b border-beige-100 hover:bg-beige-50">
                      <td className="py-3 px-4 text-gray-600">{item.day}</td>
                      <td className="py-3 px-4 font-medium">{item.time}</td>
                      <td className="py-3 px-4 text-gray-600">{item.subject || item.className}</td>
                      <td className="py-3 px-4 text-gray-600">{item.room}</td>
                      <td className="py-3 px-4 text-gray-600">{item.teacher}</td>
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
        <Card title="Attendance Record">
          {attendance.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No attendance records</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
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
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-beige-300">
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record) => (
                      <tr key={record.id} className="border-b border-beige-100 hover:bg-beige-50">
                        <td className="py-3 px-4 font-medium">{record.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            record.status === 'present'
                              ? 'bg-green-200 text-green-700'
                              : record.status === 'absent'
                              ? 'bg-red-200 text-red-700'
                              : 'bg-yellow-200 text-yellow-700'
                          }`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{record.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default React.memo(StudentDashboard);
