import React from 'react';
import { motion } from 'framer-motion';

/**
 * Universal Loading Fallback Component
 * Used as Suspense fallback for lazy-loaded routes and components
 * Displays elegant gold-themed loading state
 */
const LoadingFallback = ({ message = 'Loading...', fullPage = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={fullPage ? 'fixed inset-0 flex items-center justify-center bg-beige-100 z-50' : 'flex items-center justify-center py-12'}
    >
      <div className="text-center">
        {/* Animated Logo/Circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-6 border-4 border-gold-200 border-t-gold-500 rounded-full"
        />
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          School Manager
        </h2>
        
        {/* Message */}
        <p className="text-gray-600 text-sm">
          {message}
        </p>
        
        {/* Dots animation */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="w-2 h-2 bg-gold-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingFallback;
