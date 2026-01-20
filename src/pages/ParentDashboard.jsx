import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiBarChart2, FiBook, FiAward, FiCheckCircle, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import Card from '../components/Card';
import StatsCard from '../components/StatsCard';
import { getChildData } from '../redux/slices/parentsSlice';

/**
 * ParentDashboard - Dashboard for parents to monitor their child's progress
 * Shows grades, attendance, assignments, and incidents
 */
const ParentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { children, loading } = useSelector((state) => state.parents || { children: [], loading: false });

  const [selectedChild, setSelectedChild] = useState(null);
  const [viewMode, setViewMode] = useState('overview');

  // Load child data on mount
  useEffect(() => {
    dispatch(getChildData(user?.childId || user?.id));
  }, [dispatch, user]);

  // Set default selected child
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0]);
    }
  }, [children, selectedChild]);

  if (!selectedChild) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const { grades = [], assignments = [], attendance = [], incidents = [] } = selectedChild;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-lg p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-indigo-100">Monitor your child's academic progress and attendance</p>
      </motion.div>

      {/* Child Selector */}
      {children.length > 1 && (
        <Card>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  selectedChild.id === child.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-beige-200 text-gray-800 hover:bg-beige-300'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<FiAward size={24} />}
          label="Average Grade"
          value={grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + g.score, 0) / grades.length) : 0}
          unit="%"
          color="purple"
        />
        <StatsCard
          icon={<FiCheckCircle size={24} />}
          label="Days Present"
          value={attendance.filter((a) => a.status === 'present').length}
          color="green"
        />
        <StatsCard
          icon={<FiBook size={24} />}
          label="Completed Assignments"
          value={assignments.filter((a) => a.submitted).length}
          color="blue"
        />
        <StatsCard
          icon={<FiAlertCircle size={24} />}
          label="Incidents"
          value={incidents.length}
          color="red"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-beige-300 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: FiBarChart2 },
          { id: 'grades', label: 'Grades', icon: FiAward },
          { id: 'assignments', label: 'Assignments', icon: FiBook },
          { id: 'attendance', label: 'Attendance', icon: FiCheckCircle },
          { id: 'incidents', label: 'Incidents', icon: FiAlertCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition ${
                viewMode === tab.id
                  ? 'border-indigo-500 text-indigo-600'
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
          {/* Recent Grades */}
          <Card title="Recent Grades">
            {grades.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No grades available</p>
            ) : (
              <div className="space-y-3">
                {grades.slice(0, 5).map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div>
                      <h4 className="font-semibold text-gray-800">{grade.subject}</h4>
                      <p className="text-sm text-gray-600">{grade.exam}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-700">{grade.score}%</p>
                      <p className="text-xs text-gray-600">{grade.grade}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Pending Assignments */}
          <Card title="Pending Assignments">
            {assignments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No assignments</p>
            ) : (
              <div className="space-y-3">
                {assignments.filter((a) => !a.submitted).slice(0, 5).map((assign) => (
                  <div key={assign.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <div>
                      <h4 className="font-semibold text-gray-800">{assign.title}</h4>
                      <p className="text-sm text-gray-600">Due: {assign.dueDate}</p>
                    </div>
                    <span className="px-2 py-1 bg-orange-200 text-orange-700 rounded text-xs font-semibold">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* GRADES TAB */}
      {viewMode === 'grades' && (
        <Card title="Grade Report">
          {grades.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No grades available</p>
          ) : (
            <div className="space-y-3">
              {grades.map((grade) => (
                <div key={grade.id} className="p-4 bg-purple-50 rounded-lg border border-purple-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{grade.subject}</h4>
                    <span className="text-sm font-semibold text-gray-600">{grade.exam}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 mr-4">
                      <div
                        className="bg-purple-600 h-3 rounded-full"
                        style={{ width: `${grade.score}%` }}
                      ></div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-700">{grade.score}%</p>
                      <p className="text-xs text-gray-600">{grade.grade}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ASSIGNMENTS TAB */}
      {viewMode === 'assignments' && (
        <Card title="Assignment Status">
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
                          assign.submitted ? 'bg-green-200 text-green-700' : 'bg-orange-200 text-orange-700'
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

      {/* INCIDENTS TAB */}
      {viewMode === 'incidents' && (
        <Card title="Behavioral Incidents">
          {incidents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No incidents reported</p>
          ) : (
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div key={incident.id} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{incident.title}</h4>
                    <span className="text-xs font-semibold text-gray-600">{incident.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{incident.description}</p>
                  <p className="text-xs text-gray-600">Reported by: {incident.reportedBy}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Communication Card */}
      <Card title="Teacher Communication">
        <div className="flex flex-col gap-4">
          <p className="text-gray-600">
            Send a message to your child's teachers to discuss progress and concerns.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium w-full justify-center">
            <FiMessageSquare size={18} />
            Send Message
          </button>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(ParentDashboard);
