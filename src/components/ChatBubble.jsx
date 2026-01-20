import React from 'react';
import { motion } from 'framer-motion';

/**
 * Chat Bubble component for messages
 */
const ChatBubble = ({ message, isOwn = false, timestamp = null }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xs px-4 py-3 rounded-lg ${
          isOwn
            ? 'bg-gold-500 text-white rounded-br-none'
            : 'bg-beige-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${isOwn ? 'text-gold-100' : 'text-gray-600'}`}>
            {timestamp}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
