import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated counter component with smooth number transitions
 */
const AnimatedCounter = ({ value, duration = 2, decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const current = Math.floor(value * progress);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, decimals]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue.toFixed(decimals)}
    </motion.span>
  );
};

export default AnimatedCounter;
