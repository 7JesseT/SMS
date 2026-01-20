import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import { motion } from 'framer-motion';
import FormInput from '../components/FormInput';
import { ROLES } from '../utils/constants';

/**
 * Login Page - Authentication entry point
 */
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: ROLES.ADMIN });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    const newErrors = {};
    if (isSignUp && !formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Use provided name for signup, extract from email for login
      const displayName = isSignUp 
        ? formData.name 
        : formData.email.split('@')[0].replace(/[._-]/g, ' ').charAt(0).toUpperCase() + formData.email.split('@')[0].replace(/[._-]/g, ' ').slice(1);

      const user = {
        id: `USER${Date.now()}`,
        name: displayName,
        email: formData.email,
        role: formData.role,
      };

      dispatch(login(user));
      navigate('/dashboard', { replace: true });
      setLoading(false);
    }, 500);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setFormData({ name: '', email: '', password: '', role: ROLES.ADMIN });
  };

  const roles = [ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gold-500 via-beige-100 to-gold-600 flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gold-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">HOF</span>
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-2">School Manager</h1>
            <p className="text-gray-600 text-sm">Welcome to The Heart of Our Father School</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => !isSignUp && toggleMode()}
              className={`flex-1 py-2 font-semibold rounded-lg transition ${
                isSignUp
                  ? 'bg-gold-500 text-white shadow-md'
                  : 'bg-beige-200 text-gray-700 hover:bg-beige-300'
              }`}
            >
              Sign In (New)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => isSignUp && toggleMode()}
              className={`flex-1 py-2 font-semibold rounded-lg transition ${
                !isSignUp
                  ? 'bg-gold-500 text-white shadow-md'
                  : 'bg-beige-200 text-gray-700 hover:bg-beige-300'
              }`}
            >
              Login
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <FormInput
                label="Full Name"
                name="name"
                type="text"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
            )}

            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            {/* Role Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition"
              >
                {[ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Demo accounts: admin@hof.com, teacher@hof.com, parent@hof.com</p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-700 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isSignUp ? 'Creating Account...' : 'Logging In...') : (isSignUp ? 'Sign In' : 'Login')}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 p-4 bg-beige-100 rounded-lg border border-beige-200">
            <p className="text-xs text-gray-600 text-center mb-2">
              <strong>Demo Mode:</strong> Use any email and password with role selection
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• <strong>Admin:</strong> Full access to all features</p>
              <p>• <strong>Teacher:</strong> Access to students, messages, discipline, reports</p>
              <p>• <strong>Parent:</strong> View-only access to their child's information</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
