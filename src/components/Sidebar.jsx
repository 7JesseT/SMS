import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { MENU_ITEMS } from '../utils/constants';

/**
 * Sidebar component with responsive menu
 */
const Sidebar = ({ isOpen = true, onClose = null }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = MENU_ITEMS[user?.role] || [];

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className="fixed md:relative md:translate-x-0 left-0 top-0 h-screen w-64 bg-gradient-to-b from-gold-50 to-beige-100 border-r border-gold-200 overflow-y-auto z-40 pt-20 md:pt-0"
        animate={{
          x: !onClose || isOpen ? 0 : -256,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-6 border-b border-gold-200">
          <h1 className="text-xl font-bold text-gold-700">HOF School</h1>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 px-2">
          {menuItems.map((item, index) => {
            const IconComponent = FiIcons[item.icon] || FiIcons.FiHome;
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-500 text-white border-r-4 border-gold-700 shadow-md'
                    : 'text-gray-700 hover:bg-gold-100 hover:text-gold-700'
                }`}
                role="menuitem"
              >
                <IconComponent size={22} className="flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gold-200 bg-white/50 hidden md:block">
          <p className="text-xs text-gray-600 text-center">
            <strong>{user?.role}</strong>
            <br />
            {user?.email}
          </p>
        </div>
      </motion.aside>
    </>
  );
};

export default React.memo(Sidebar);
