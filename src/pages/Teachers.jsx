import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import DataTable from '../components/DataTable';
import Card from '../components/Card';
import { FiStar } from 'react-icons/fi';

/**
 * Teachers Page - View and manage teachers
 */
const Teachers = () => {
  const { teachers } = useSelector((state) => state.data);

  const columns = [
    {
      Header: 'Photo',
      accessor: 'photo',
      Cell: ({ value }) => (
        <img src={value} alt="teacher" className="w-10 h-10 rounded-full" loading="lazy" />
      ),
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Subjects',
      accessor: 'subjects',
      Cell: ({ value }) => (
        <div className="flex gap-1 flex-wrap">
          {value?.slice(0, 2).map((subject) => (
            <span key={subject} className="badge badge-gold text-xs">
              {subject}
            </span>
          ))}
          {value?.length > 2 && (
            <span className="badge badge-gold text-xs">+{value.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Rating',
      accessor: 'rating',
      Cell: ({ value }) => (
        <div className="flex items-center gap-1">
          <FiStar size={16} className="text-gold-500" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      Header: 'Experience',
      accessor: 'yearsOfExperience',
      Cell: ({ value }) => <span>{value} years</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Teachers</h1>
        <p className="text-gray-600 mt-2">Manage and view teacher information</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Teachers', value: teachers.length },
          {
            label: 'Avg Rating',
            value: (
              teachers.reduce((sum, t) => sum + parseFloat(t.rating), 0) / teachers.length
            ).toFixed(1),
          },
          {
            label: 'Avg Experience',
            value: Math.round(
              teachers.reduce((sum, t) => sum + t.yearsOfExperience, 0) / teachers.length
            ),
          },
        ].map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }}>
            <Card className="text-center">
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gold-700">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <Card title="Teacher List">
        <DataTable data={teachers} columns={columns} />
      </Card>
    </div>
  );
};

export default Teachers;
