import React from 'react';
import { motion } from 'framer-motion';
import { FiBell } from 'react-icons/fi';

/**
 * Notification Bell component
 */
const NotificationBell = ({ count = 0, onClick = () => {}, animate = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative p-2 hover:bg-beige-200 rounded-lg transition"
      aria-label={`Notifications: ${count}`}
    >
      <FiBell size={24} className="text-gray-600" />
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  );
};

export default NotificationBell;
