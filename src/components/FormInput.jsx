import React from 'react';
import { motion } from 'framer-motion';

/**
 * Form Input component
 */
const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder = '',
  value = '',
  onChange = () => {},
  error = '',
  required = false,
  disabled = false,
  icon: Icon = null,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon size={20} className="absolute left-3 top-3 text-gray-400" />}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border rounded-lg focus:outline-none transition ${
            error
              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
              : 'border-beige-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FormInput;
