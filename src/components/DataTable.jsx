import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown } from 'react-icons/fi';

/**
 * DataTable component - Simple table with sorting, filtering, and pagination
 */
const DataTable = ({ data = [], columns = [], loading = false, onRowClick = null }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const pageSize = 10;

  // Filter data
  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }, [data, globalFilter]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    return sortedData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [sortedData, pageIndex]);

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const canNextPage = pageIndex < pageCount - 1;
  const canPreviousPage = pageIndex > 0;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search table..."
        className="w-full px-4 py-2 border border-beige-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />


      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-beige-200">
        <table className="w-full">
          <thead className="bg-beige-100 border-b border-beige-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-beige-200 transition"
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortConfig.key === col.key && (
                      <span className="text-gold-600">
                        {sortConfig.direction === 'asc' ? <FiArrowUp size={16} /> : <FiArrowDown size={16} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedData.map((row, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`border-b border-beige-200 transition ${
                    onRowClick ? 'hover:bg-gold-100/50 cursor-pointer' : 'hover:bg-beige-50'
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {pageIndex + 1} of {pageCount || 1} • Total: {filteredData.length} items
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={!canPreviousPage}
            className="flex items-center gap-1 px-3 py-2 border border-beige-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-beige-100 transition"
          >
            <FiChevronLeft size={18} />
            Prev
          </button>
          <button
            onClick={() => setPageIndex((p) => (canNextPage ? p + 1 : p))}
            disabled={!canNextPage}
            className="flex items-center gap-1 px-3 py-2 border border-beige-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-beige-100 transition"
          >
            Next
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
