import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiDownload, FiFilter } from 'react-icons/fi';
import Card from './Card';
import { formatDate } from '../utils/helpers';

/**
 * AuditTable - Display audit logs with filtering and export
 */
const AuditTable = ({ onExport = null }) => {
  const { logs } = useSelector((state) => state.audit);
  const [filterAction, setFilterAction] = React.useState('');
  const [filterUserId, setFilterUserId] = React.useState('');

  const filteredLogs = logs.filter((log) => {
    const actionMatch = !filterAction || log.action.includes(filterAction);
    const userMatch = !filterUserId || log.userId.includes(filterUserId);
    return actionMatch && userMatch;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
      default:
        return 'text-blue-600';
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 pb-4 border-b border-beige-200">
          <div className="flex items-center gap-2">
            <FiFilter size={18} className="text-gray-600" />
            <input
              type="text"
              placeholder="Filter by action..."
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <input
            type="text"
            placeholder="Filter by user ID..."
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          {onExport && (
            <button
              onClick={() => onExport(filteredLogs)}
              className="ml-auto flex items-center gap-2 px-3 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition text-sm"
            >
              <FiDownload size={16} />
              Export
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-beige-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Module</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Details</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Severity</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-beige-100 hover:bg-beige-50 transition"
                  >
                    <td className="py-3 px-4 text-gray-700">{formatDate(log.timestamp)}</td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">{log.userId}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{log.module}</td>
                    <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{log.details}</td>
                    <td className={`py-3 px-4 font-semibold ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-beige-200 text-xs text-gray-600">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      </div>
    </Card>
  );
};

export default AuditTable;
