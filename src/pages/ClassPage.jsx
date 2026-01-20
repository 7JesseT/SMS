import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUsers, FiCheckCircle, FiAward, FiList, FiAlertCircle, FiPlus } from 'react-icons/fi';
import Card from '../components/Card';
import StatsCard from '../components/StatsCard';
import { getClassById, updateClass } from '../redux/slices/classesSlice';
import { getAttendanceByClass } from '../redux/slices/attendanceSlice';
import { getGradesByClass } from '../redux/slices/gradesSlice';

/**
 * ClassPage - Detailed view of a single class with students, grades, and attendance
 */
const ClassPage = () => {
  const { classId } = useParams();
  const dispatch = useDispatch();

  const classData = useSelector((state) =>
    state.classes?.items.find((c) => c.id === classId)
  );
  const [viewMode, setViewMode] = useState('overview');
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);

  // Load data
  useEffect(() => {
    dispatch(getClassById(classId));
    dispatch(getAttendanceByClass(classId));
    dispatch(getGradesByClass(classId));
  }, [dispatch, classId]);

  if (!classData) {
    return <div className="text-center py-8 text-gray-500">Loading class...</div>;
  }

  const { students = [], name, teacher, term, room } = classData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <p className="text-blue-100">
          {teacher} • {room} • {students.length} students
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          icon={<FiUsers size={24} />}
          label="Total Students"
          value={students.length}
          color="blue"
        />
        <StatsCard
          icon={<FiCheckCircle size={24} />}
          label="Average Attendance"
          value="85%"
          color="green"
        />
        <StatsCard
          icon={<FiAward size={24} />}
          label="Class Average"
          value="78%"
          color="purple"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-beige-300 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: FiList },
          { id: 'students', label: 'Students', icon: FiUsers },
          { id: 'attendance', label: 'Attendance', icon: FiCheckCircle },
          { id: 'grades', label: 'Grades', icon: FiAward },
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
          {/* Class Information */}
          <Card title="Class Information">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Class Name:</span>
                <span className="text-gray-800 font-semibold">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Teacher:</span>
                <span className="text-gray-800 font-semibold">{teacher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Room:</span>
                <span className="text-gray-800 font-semibold">{room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Term:</span>
                <span className="text-gray-800 font-semibold">{term}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Students:</span>
                <span className="text-gray-800 font-semibold">{students.length}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <FiCheckCircle size={18} />
                Mark Attendance
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <FiAward size={18} />
                Update Grades
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                <FiPlus size={18} />
                Add Assignment
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* STUDENTS TAB */}
      {viewMode === 'students' && (
        <Card title="Class Students">
          {students.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No students in this class</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-beige-300">
                    <th className="text-left py-3 px-4 font-semibold">Student Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Roll No</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Contact</th>
                    <th className="text-center py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student.id} className="border-b border-beige-100 hover:bg-beige-50">
                      <td className="py-3 px-4 font-medium">{student.name}</td>
                      <td className="py-3 px-4 text-gray-600">{idx + 1}</td>
                      <td className="py-3 px-4 text-gray-600">{student.email}</td>
                      <td className="py-3 px-4 text-gray-600">{student.phone || '-'}</td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          View Details
                        </button>
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
        <Card title="Class Attendance">
          <div className="mb-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              Mark Attendance
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige-300">
                  <th className="text-left py-3 px-4 font-semibold">Student</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-center py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 10).map((student) => (
                  <tr key={`${student.id}-attendance`} className="border-b border-beige-100 hover:bg-beige-50">
                    <td className="py-3 px-4 font-medium">{student.name}</td>
                    <td className="py-3 px-4 text-gray-600">{new Date().toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 bg-green-200 text-green-700 rounded text-xs font-semibold">
                        Present
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* GRADES TAB */}
      {viewMode === 'grades' && (
        <Card title="Class Grades">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige-300">
                  <th className="text-left py-3 px-4 font-semibold">Student</th>
                  <th className="text-center py-3 px-4 font-semibold">Test 1</th>
                  <th className="text-center py-3 px-4 font-semibold">Test 2</th>
                  <th className="text-center py-3 px-4 font-semibold">Final</th>
                  <th className="text-center py-3 px-4 font-semibold">Average</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={`${student.id}-grades`} className="border-b border-beige-100 hover:bg-beige-50">
                    <td className="py-3 px-4 font-medium">{student.name}</td>
                    <td className="py-3 px-4 text-center text-gray-600">85%</td>
                    <td className="py-3 px-4 text-center text-gray-600">90%</td>
                    <td className="py-3 px-4 text-center text-gray-600">88%</td>
                    <td className="py-3 px-4 text-center font-semibold text-blue-600">88%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default React.memo(ClassPage);
