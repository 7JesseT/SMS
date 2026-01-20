import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, switchRole } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiChevronDown, FiMenu, FiX, FiBell, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { markAllRead } from '../redux/slices/notificationSlice';

/**
 * Header component with navigation, search, and notifications
 */
const Header = ({ onToggleSidebar = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notification);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSwitchRole = (role) => {
    dispatch(switchRole(role));
    setRoleDropdownOpen(false);
  };

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const roles = ['Admin', 'Teacher', 'Parent'];

  return (
    <header className="bg-white border-b border-beige-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Left: Logo and Hamburger */}
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 hover:bg-beige-200 rounded-lg transition"
              aria-label="Toggle sidebar"
            >
              <FiMenu size={24} className="text-gold-600" />
            </button>
          )}
          <div className="hidden md:flex items-center">
            <h1 className="text-2xl font-bold text-gold-600">HOF School Manager</h1>
          </div>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 mx-8">
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-600" size={18} />
            <input
              type="text"
              placeholder="Search students, teachers..."
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30 transition font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right: Notifications, Role Switcher, User Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 hover:bg-beige-200 rounded-lg transition"
              aria-label="Notifications"
            >
              <FiBell size={22} className="text-gray-600" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>

            {notificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 bg-white border border-beige-200 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-4 border-b border-beige-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-sm text-gold-600 hover:text-gold-700"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        className={`p-4 border-b border-beige-100 ${!notif.read ? 'bg-gold-100/30' : ''}`}
                      >
                        <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-beige-100 hover:bg-beige-200 rounded-lg transition text-sm font-medium text-gold-700"
            >
              {user?.role || 'Role'}
              <FiChevronDown size={18} />
            </button>

            {roleDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-32 bg-white border border-beige-200 rounded-lg shadow-lg"
              >
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleSwitchRole(role)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-beige-100 transition ${
                      user?.role === role ? 'bg-gold-100 text-gold-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* User Avatar and Logout */}
          <div className="flex items-center gap-3 ml-2 md:ml-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-medium text-gray-800">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'N/A'}</p>
            </div>
            <div className="w-10 h-10 bg-gold-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-100 rounded-lg transition"
              title="Logout"
              aria-label="Logout"
            >
              <FiLogOut size={20} className="text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
