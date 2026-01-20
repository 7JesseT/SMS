import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Card component
 */
const Card = ({
  title,
  children,
  className = '',
  onClick = null,
  hover = true,
  animated = true,
}) => {
  const baseClasses =
    'bg-white rounded-lg shadow-md p-6 border border-beige-200 transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-lg hover:border-gold-500' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';

  const content = (
    <div className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      {children}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onClick}
      >
        {content}
      </motion.div>
    );
  }

  return <div onClick={onClick}>{content}</div>;
};

export default React.memo(Card);
