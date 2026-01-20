import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import SmallSkeleton from './SmallSkeleton';

/**
 * CrudModal - Reusable form modal for create/edit operations
 */
const CrudModal = ({
  isOpen = false,
  title = 'Form',
  onClose = () => {},
  onSubmit = () => {},
  fields = [],
  initialData = {},
  loading = false,
  submitText = 'Save',
  isDangerous = false,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-beige-200">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {loading ? (
                  <div className="space-y-4">
                    {fields.map((field) => (
                      <SmallSkeleton key={field.name} height="40px" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {fields.map((field) => (
                      <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                        {field.type === 'textarea' ? (
                          <>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <textarea
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleChange}
                              placeholder={field.placeholder}
                              rows={field.rows || 3}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                                errors[field.name] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                          </>
                        ) : field.type === 'select' ? (
                          <>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <select
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                                errors[field.name] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">Select {field.label}</option>
                              {field.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : field.type === 'checkbox' ? (
                          <div className="flex items-center mt-6">
                            <input
                              type="checkbox"
                              name={field.name}
                              checked={formData[field.name] || false}
                              onChange={handleChange}
                              className="w-4 h-4 text-gold-600 rounded focus:ring-2 focus:ring-gold-500"
                            />
                            <label className="ml-3 text-sm font-medium text-gray-700">
                              {field.label}
                            </label>
                          </div>
                        ) : (
                          <>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <input
                              type={field.type || 'text'}
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleChange}
                              placeholder={field.placeholder}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                                errors[field.name] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                          </>
                        )}
                        {errors[field.name] && (
                          <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </form>

              {/* Footer */}
              <div className="flex gap-3 justify-end p-6 border-t border-beige-200">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-4 py-2 text-white rounded-lg font-semibold transition ${
                    isDangerous
                      ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                      : 'bg-gold-600 hover:bg-gold-700 disabled:bg-gold-400'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Processing...' : submitText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CrudModal;
