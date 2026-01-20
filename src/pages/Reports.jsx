import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import ChartWidget from '../components/ChartWidget';

/**
 * Reports Page - Analytics and visualizations
 */
const Reports = () => {
  const { reports } = useSelector((state) => state.data);

  const attendanceData = {
    labels: reports.attendance?.map((item) => item.month) || [],
    datasets: [
      {
        label: 'Attendance %',
        data: reports.attendance?.map((item) => item.percentage) || [],
        borderColor: '#D4AF37',
        backgroundColor: '#D4AF3730',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const gradesData = {
    labels: reports.grades?.map((item) => item.subject) || [],
    datasets: [
      {
        label: 'Average Score',
        data: reports.grades?.map((item) => item.average) || [],
        backgroundColor: ['#D4AF37', '#CDA434', '#A67C00', '#8A5C1A', '#5A3C0A'],
      },
    ],
  };

  const financialData = {
    labels: reports.financial?.map((item) => item.month) || [],
    datasets: [
      {
        label: 'Income',
        data: reports.financial?.map((item) => item.income) || [],
        borderColor: '#22c55e',
        backgroundColor: '#22c55e30',
        fill: true,
      },
      {
        label: 'Expenses',
        data: reports.financial?.map((item) => item.expense) || [],
        borderColor: '#ef4444',
        backgroundColor: '#ef444430',
        fill: true,
      },
    ],
  };

  const teacherRatingsData = {
    labels: reports.teacherRatings?.map((item) => item.name) || [],
    datasets: [
      {
        label: 'Rating',
        data: reports.teacherRatings?.map((item) => item.rating) || [],
        backgroundColor: '#D4AF37',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">School performance metrics and insights</p>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ChartWidget type="line" title="Attendance Trends" data={attendanceData} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ChartWidget type="bar" title="Subject Performance" data={gradesData} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <ChartWidget type="line" title="Financial Overview" data={financialData} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <ChartWidget type="bar" title="Teacher Ratings" data={teacherRatingsData} />
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
