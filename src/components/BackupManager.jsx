import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiDownload, FiTrash2, FiRefreshCw, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Card from './Card';
import ConfirmDialog from './ConfirmDialog';
import { createBackup, deleteBackup } from '../redux/slices/backupSlice';
import { setData } from '../redux/slices/dataSlice';
import { addAuditLog } from '../redux/slices/auditSlice';
import { formatDate } from '../utils/helpers';
import SmallSkeleton from './SmallSkeleton';

/**
 * BackupManager - Create, list, restore, and delete backups
 */
const BackupManager = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { backups, loading } = useSelector((state) => state.backup);
  const { data } = useSelector((state) => state.data);

  const [backupName, setBackupName] = useState('');
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBackup = async () => {
    if (!backupName.trim()) {
      toast.error('Backup name is required');
      return;
    }

    setIsCreating(true);
    // Simulate backup creation delay
    setTimeout(() => {
      const currentData = localStorage.getItem('hof_data');
      dispatch(
        createBackup({
          name: backupName,
          userId: user?.id,
          data: currentData ? JSON.parse(currentData) : data,
        })
      );

      dispatch(
        addAuditLog({
          userId: user?.id,
          action: 'backups.create',
          module: 'admin',
          details: `Created backup: ${backupName}`,
          severity: 'info',
        })
      );

      toast.success('✓ Backup created successfully!');
      setBackupName('');
      setIsCreating(false);
    }, 600);
  };

  const handleRestoreBackup = (backupId) => {
    setSelectedBackupId(backupId);
    setConfirmRestore(true);
  };

  const confirmRestore_execute = () => {
    const backup = backups.find((b) => b.id === selectedBackupId);
    if (!backup) {
      toast.error('Backup not found');
      return;
    }

    // Simulate restore delay
    setTimeout(() => {
      dispatch(setData(backup.data));
      localStorage.setItem('hof_data', JSON.stringify(backup.data));

      dispatch(
        addAuditLog({
          userId: user?.id,
          action: 'backups.restore',
          module: 'admin',
          details: `Restored backup: ${backup.name}`,
          severity: 'warning',
        })
      );

      toast.success(`✓ Restored backup: ${backup.name}`);
      setConfirmRestore(false);
      setSelectedBackupId(null);
    }, 700);
  };

  const handleDeleteBackup = (backupId) => {
    dispatch(deleteBackup(backupId));
    dispatch(
      addAuditLog({
        userId: user?.id,
        action: 'backups.delete',
        module: 'admin',
        details: `Deleted backup`,
        severity: 'warning',
      })
    );
    toast.success('✓ Backup deleted');
  };

  const handleExportBackup = (backup) => {
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${backup.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    dispatch(
      addAuditLog({
        userId: user?.id,
        action: 'backups.export',
        module: 'admin',
        details: `Exported backup: ${backup.name}`,
        severity: 'info',
      })
    );
    
    toast.success('✓ Backup exported');
  };

  return (
    <>
      <Card title="Backup Management">
        <div className="space-y-6">
          {/* Create Backup Section */}
          <div className="bg-beige-50 p-4 rounded-lg border border-beige-200">
            <h3 className="font-semibold text-gray-800 mb-3">Create New Backup</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                placeholder="e.g., Before Mid-term Exams"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                disabled={isCreating}
              />
              <button
                onClick={handleCreateBackup}
                disabled={isCreating}
                className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 disabled:bg-gold-400 transition flex items-center gap-2"
              >
                <FiSave size={18} />
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>

          {/* Backups List */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Saved Backups ({backups.length})</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <SmallSkeleton key={i} height="60px" />
                ))}
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8 bg-beige-50 rounded-lg border border-beige-200">
                <p className="text-gray-500">No backups yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {backups.map((backup) => (
                  <motion.div
                    key={backup.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-beige-50 rounded-lg border border-beige-200 hover:bg-beige-100 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800">{backup.name}</p>
                      <p className="text-xs text-gray-600">
                        {formatDate(backup.createdAt)} • by {backup.createdBy}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExportBackup(backup)}
                        className="p-2 hover:bg-white rounded-lg transition text-blue-600"
                        title="Export"
                      >
                        <FiDownload size={18} />
                      </button>
                      <button
                        onClick={() => handleRestoreBackup(backup.id)}
                        className="p-2 hover:bg-white rounded-lg transition text-gold-600"
                        title="Restore"
                      >
                        <FiRefreshCw size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteBackup(backup.id)}
                        className="p-2 hover:bg-white rounded-lg transition text-red-600"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Confirm Restore Dialog */}
      <ConfirmDialog
        isOpen={confirmRestore}
        title="Restore Backup?"
        message="This will replace all current data with the backup. Are you sure?"
        confirmText="Restore"
        isDangerous={true}
        onConfirm={confirmRestore_execute}
        onCancel={() => setConfirmRestore(false)}
      />
    </>
  );
};

export default BackupManager;
