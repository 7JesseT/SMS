import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import ChartWidget from '../components/ChartWidget';
import PDFExportButton from '../components/PDFExportButton';
import { FiArrowLeft, FiPhone, FiMail } from 'react-icons/fi';

/**
 * Student Profile Page - Detailed view of a single student
 */
const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, reports } = useSelector((state) => state.data);
  const [activeTab, setActiveTab] = useState('overview');

  const student = students.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600 text-lg">Student not found</p>
      </div>
    );
  }

  const gradesChartData = {
    labels: Object.keys(student.grades || {}),
    datasets: [
      {
        label: 'Scores',
        data: Object.values(student.grades || {}),
        backgroundColor: '#D4AF37',
      },
    ],
  };

  const tabs = ['overview', 'attendance', 'grades', 'health', 'library'];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate('/students')}
        className="flex items-center gap-2 text-gold-600 hover:text-gold-700 transition"
      >
        <FiArrowLeft size={20} />
        Back to Students
      </motion.button>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-lg p-8 text-white"
      >
        <div className="flex gap-6 items-start">
          <img
            src={student.photo}
            alt={student.firstName}
            className="w-32 h-32 rounded-lg border-4 border-white/50"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gold-100 mb-4">Class: {student.class}</p>
            <div className="flex gap-6">
              <div>
                <p className="text-gold-100 text-sm">Student ID</p>
                <p className="font-semibold">{student.id}</p>
              </div>
              <div>
                <p className="text-gold-100 text-sm">Admission No</p>
                <p className="font-semibold">{student.admissionNo}</p>
              </div>
              <div>
                <p className="text-gold-100 text-sm">Attendance</p>
                <p className="font-semibold">{student.attendancePercent}%</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Card>
        <div className="flex gap-4 border-b border-beige-200 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-gold-500 text-gold-700'
                  : 'text-gray-600 hover:text-gold-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-semibold text-gray-800">{student.dob}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-semibold text-gray-800">{student.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Guardian</p>
                <p className="font-semibold text-gray-800">{student.guardian.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Guardian Relation</p>
                <p className="font-semibold text-gray-800">{student.guardian.relation}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 mb-2">Contact Information</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-gray-800">
                    <FiPhone size={18} /> {student.contact.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-800">
                    <FiMail size={18} /> {student.contact.email}
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <PDFExportButton
                  type="id-card"
                  data={student}
                  fileName={`${student.firstName}_${student.lastName}_ID.pdf`}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'grades' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ChartWidget
                type="bar"
                title="Subject Scores"
                data={gradesChartData}
              />
            </motion.div>
          )}

          {activeTab === 'health' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Blood Group</p>
                <p className="text-2xl font-bold text-gold-700">{student.health.bloodGroup}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Allergies</p>
                <div className="flex gap-2 flex-wrap">
                  {student.health.allergies.length > 0 ? (
                    student.health.allergies.map((allergy) => (
                      <span key={allergy} className="badge badge-warning">
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No known allergies</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Borrowed Books</h3>
                {student.libraryBorrowed.length > 0 ? (
                  student.libraryBorrowed.map((book) => (
                    <div
                      key={book.bookId}
                      className="p-3 bg-beige-100 rounded-lg border border-beige-200"
                    >
                      <p className="font-medium text-gray-800">{book.bookId}</p>
                      <p className="text-sm text-gray-600">
                        {book.returned ? 'Returned' : 'Active'} • Due:{' '}
                        {book.dueDate}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No books borrowed</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentProfile;
