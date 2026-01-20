import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle } from 'react-icons/fi';

/**
 * Confirm Dialog component
 */
const ConfirmDialog = ({
  isOpen = false,
  title = 'Confirm Action',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm = () => {},
  onCancel = () => {},
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 max-w-sm z-50"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div className="flex items-start gap-4 mb-4">
              {isDangerous && <FiAlertCircle size={24} className="text-red-500 flex-shrink-0" />}
              <div>
                <h2 id="dialog-title" className="text-lg font-bold text-gray-800">
                  {title}
                </h2>
                <p className="text-gray-600 mt-2">{message}</p>
              </div>
              <button
                onClick={onCancel}
                className="p-1 hover:bg-beige-200 rounded transition ml-auto flex-shrink-0"
                aria-label="Close dialog"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 border border-beige-200 rounded-lg hover:bg-beige-100 transition"
              >
                {cancelText}
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className={`px-4 py-2 text-white rounded-lg transition font-medium ${
                  isDangerous ? 'bg-red-600 hover:bg-red-700' : 'bg-gold-600 hover:bg-gold-700'
                }`}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
