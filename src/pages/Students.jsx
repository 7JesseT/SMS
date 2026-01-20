import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DataTable from '../components/DataTable';
import Card from '../components/Card';
import { formatPercentage } from '../utils/helpers';
import { fetchStudents } from '../utils/mockApi';
import { FiEye, FiEdit, FiPlus } from 'react-icons/fi';

/**
 * Students Page - View and manage students
 */
const Students = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students } = useSelector((state) => state.data);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const columns = [
    {
      Header: 'Photo',
      accessor: 'photo',
      Cell: ({ value }) => (
        <img src={value} alt="student" className="w-10 h-10 rounded-full" loading="lazy" />
      ),
    },
    {
      Header: 'Name',
      accessor: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      Header: 'Admission No',
      accessor: 'admissionNo',
    },
    {
      Header: 'Class',
      accessor: 'class',
    },
    {
      Header: 'Attendance',
      accessor: 'attendancePercent',
      Cell: ({ value }) => (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-beige-200 rounded-full h-2">
            <div
              className={`h-full rounded-full ${
                value >= 80 ? 'bg-green-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-medium">{formatPercentage(value)}</span>
        </div>
      ),
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/students/${row.original.id}`)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
            title="View"
          >
            <FiEye size={18} />
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        {user?.role === 'Admin' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition"
          >
            <FiPlus size={20} />
            Add Student
          </motion.button>
        )}
      </motion.div>

      {/* Search */}
      <Card>
        <input
          type="text"
          placeholder="Search by name, admission number..."
          className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:border-gold-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Table */}
      <Card title="Student List">
        <DataTable
          data={filteredStudents}
          columns={columns}
          onRowClick={(student) => navigate(`/students/${student.id}`)}
        />
      </Card>
    </div>
  );
};

export default Students;
