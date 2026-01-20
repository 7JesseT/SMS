import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loading Spinner component
 */
const LoadingSpinner = ({ fullPage = false, text = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-beige-200 border-t-gold-500 rounded-full"
      />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        {content}
      </motion.div>
    );
  }

  return <div className="flex justify-center items-center py-12">{content}</div>;
};

export default LoadingSpinner;
