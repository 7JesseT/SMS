import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUsers, FiSettings, FiLock, FiServer, FiDownload, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import CrudModal from '../components/CrudModal';
import ConfirmDialog from '../components/ConfirmDialog';
import BackupManager from '../components/BackupManager';
import AuditTable from '../components/AuditTable';
import { addUser, deleteUser, updateUser, loadUsers } from '../redux/slices/usersSlice';
import { addAuditLog } from '../redux/slices/auditSlice';
import { updateSchoolInfo, updateSecurity, updateFeatures } from '../redux/slices/settingsSlice';
import { getPermissionGroups, getPermissionsForRole } from '../utils/permissions';
import { exportToCSV, delay } from '../utils/helpers';

/**
 * AdminSection - Comprehensive admin dashboard for system management
 */
const AdminSection = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { logs: auditLogs } = useSelector((state) => state.audit);
  const settings = useSelector((state) => state.settings);

  const [activeTab, setActiveTab] = useState('users');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Load users on mount
  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  const openUserModal = (userData = null) => {
    if (userData) {
      setEditingUser(userData);
      setSelectedPermissions(userData.permissions || []);
    } else {
      setEditingUser(null);
      setSelectedPermissions([]);
    }
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
    setSelectedPermissions([]);
  };

  const handleUserFormSubmit = async (formData) => {
    setFormSubmitting(true);
    await delay(500);

    const userData = {
      ...formData,
      permissions: selectedPermissions.length > 0 ? selectedPermissions : getPermissionsForRole(formData.role),
    };

    if (editingUser) {
      dispatch(updateUser({ id: editingUser.id, ...userData }));
      dispatch(addAuditLog({
        userId: user?.id,
        action: 'users.update',
        module: 'admin',
        details: `Updated user: ${userData.email}`,
        severity: 'info',
      }));
      toast.success('✓ User updated successfully');
    } else {
      dispatch(addUser(userData));
      dispatch(addAuditLog({
        userId: user?.id,
        action: 'users.create',
        module: 'admin',
        details: `Created user: ${userData.email}`,
        severity: 'info',
      }));
      toast.success('✓ User created successfully');
    }

    setFormSubmitting(false);
    closeUserModal();
  };

  const handleDeleteUser = async () => {
    setFormSubmitting(true);
    await delay(500);

    dispatch(deleteUser(confirmDeleteUserId));
    dispatch(addAuditLog({
      userId: user?.id,
      action: 'users.delete',
      module: 'admin',
      details: `Deleted user`,
      severity: 'warning',
    }));
    toast.success('✓ User deleted');

    setFormSubmitting(false);
    setConfirmDeleteUserId(null);
  };

  const handleExportAuditLogs = () => {
    const logsForExport = auditLogs.map((log) => ({
      Timestamp: log.timestamp,
      User: log.userId,
      Action: log.action,
      Module: log.module,
      Details: log.details,
      Severity: log.severity,
    }));
    exportToCSV(logsForExport, 'audit-logs.csv');
    toast.success('✓ Audit logs exported');
  };

  const userFields = [
    { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john@hof.local' },
    { name: 'password', label: 'Password', type: 'password', required: !editingUser, placeholder: 'demo1234' },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'parent', label: 'Parent' },
        { value: 'student', label: 'Student' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500 to-red-700 rounded-lg p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-red-100">System settings, users, backups & audit logs</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-beige-300 overflow-x-auto">
        {[
          { id: 'users', label: 'Users', icon: FiUsers },
          { id: 'settings', label: 'Settings', icon: FiSettings },
          { id: 'security', label: 'Security', icon: FiLock },
          { id: 'backups', label: 'Backups', icon: FiServer },
          { id: 'audit', label: 'Audit Logs', icon: FiDownload },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">User Management</h2>
            <button
              onClick={() => openUserModal()}
              className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition"
            >
              <FiPlus size={18} />
              Add User
            </button>
          </div>

          {usersLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-beige-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Permissions</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-beige-100 hover:bg-beige-50 transition">
                      <td className="py-3 px-4 font-medium text-gray-800">{u.name}</td>
                      <td className="py-3 px-4 text-gray-700">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold capitalize">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {u.permissions.includes('*') ? 'All' : u.permissions.length}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openUserModal(u)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600 mr-2"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteUserId(u.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <Card title="School Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
              <input
                type="text"
                defaultValue={settings.schoolInfo.name}
                onChange={(e) => dispatch(updateSchoolInfo({ name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                defaultValue={settings.schoolInfo.email}
                onChange={(e) => dispatch(updateSchoolInfo({ email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                defaultValue={settings.schoolInfo.address}
                onChange={(e) => dispatch(updateSchoolInfo({ address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.features.allowSelfMark}
                  onChange={(e) => dispatch(updateFeatures({ allowSelfMark: e.target.checked }))}
                  className="w-4 h-4 text-gold-600 rounded focus:ring-2 focus:ring-gold-500"
                />
                <span className="text-gray-700">Allow students to mark own attendance</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.features.allowParentPayments}
                  onChange={(e) => dispatch(updateFeatures({ allowParentPayments: e.target.checked }))}
                  className="w-4 h-4 text-gold-600 rounded focus:ring-2 focus:ring-gold-500"
                />
                <span className="text-gray-700">Allow parents to make payments online</span>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <Card title="Security Settings">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Password Policy</h3>
              <div className="space-y-3 bg-beige-50 p-4 rounded-lg">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordPolicy.requireUppercase}
                    onChange={(e) => dispatch(updateSecurity({
                      passwordPolicy: { ...settings.security.passwordPolicy, requireUppercase: e.target.checked }
                    }))}
                    className="w-4 h-4 text-gold-600 rounded"
                  />
                  <span className="text-gray-700">Require uppercase letters</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordPolicy.requireNumbers}
                    onChange={(e) => dispatch(updateSecurity({
                      passwordPolicy: { ...settings.security.passwordPolicy, requireNumbers: e.target.checked }
                    }))}
                    className="w-4 h-4 text-gold-600 rounded"
                  />
                  <span className="text-gray-700">Require numbers</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordPolicy.requireSpecialChars}
                    onChange={(e) => dispatch(updateSecurity({
                      passwordPolicy: { ...settings.security.passwordPolicy, requireSpecialChars: e.target.checked }
                    }))}
                    className="w-4 h-4 text-gold-600 rounded"
                  />
                  <span className="text-gray-700">Require special characters</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Two-Factor Authentication</h3>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.security.twoFAEnabled}
                  onChange={(e) => dispatch(updateSecurity({ twoFAEnabled: e.target.checked }))}
                  className="w-4 h-4 text-gold-600 rounded"
                />
                <span className="text-gray-700">Enable 2FA for all users</span>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* BACKUPS TAB */}
      {activeTab === 'backups' && <BackupManager />}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <AuditTable onExport={handleExportAuditLogs} />
      )}

      {/* User Form Modal */}
      <CrudModal
        isOpen={isUserModalOpen}
        title={editingUser ? 'Edit User' : 'Create User'}
        fields={userFields}
        initialData={editingUser || { role: 'teacher' }}
        onSubmit={handleUserFormSubmit}
        onClose={closeUserModal}
        loading={formSubmitting}
        submitText={editingUser ? 'Update' : 'Create'}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDeleteUserId}
        title="Delete User?"
        message="This user and all associated data will be permanently removed."
        confirmText="Delete"
        isDangerous={true}
        onConfirm={handleDeleteUser}
        onCancel={() => setConfirmDeleteUserId(null)}
        loading={formSubmitting}
      />
    </div>
  );
};

export default React.memo(AdminSection);
