import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { FiHome, FiBox, FiHeart, FiBook } from 'react-icons/fi';

/**
 * Stub pages for remaining routes - these can be enhanced later
 */

const Hostel = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-xl p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Hostel Management</h1>
        <p className="text-gold-100">Manage student accommodation</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Rooms', value: 24, icon: FiHome },
          { label: 'Occupied', value: 18, icon: FiHome },
          { label: 'Available', value: 6, icon: FiHome },
          { label: 'Wardens', value: 3, icon: FiBook },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="text-center">
                <Icon size={24} className="mx-auto mb-2 text-gold-600" />
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gold-700">{stat.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Room Allocation</h3>
        <p className="text-gray-600">Coming soon - manage student rooms and hostel facilities</p>
      </Card>
    </motion.div>
  );
};

const Spiritual = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-xl p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Spiritual Time</h1>
        <p className="text-gold-100">Manage spiritual activities and readings</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Readings', value: 45, icon: FiBook },
          { label: 'Services', value: 12, icon: FiHeart },
          { label: 'Books', value: 28, icon: FiBook },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="text-center">
                <Icon size={24} className="mx-auto mb-2 text-gold-600" />
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gold-700">{stat.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Spiritual Resources</h3>
        <p className="text-gray-600">Coming soon - manage readings, services, and spiritual books</p>
      </Card>
    </motion.div>
  );
};

const NotFound = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center h-screen bg-beige-100"
  >
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gold-700 mb-4">404</h1>
      <p className="text-2xl text-gray-800 mb-2">Page Not Found</p>
      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
    </div>
  </motion.div>
);

export { Hostel, Spiritual, NotFound };
