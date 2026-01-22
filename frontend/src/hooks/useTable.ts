import { useState, useMemo } from 'react';
import { useSort } from './useSort';
import { useFilter } from './useFilter';
import { usePagination } from './usePagination';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

interface UseTableOptions<T> {
  searchableFields?: (keyof T)[];
  initialPageSize?: number;
}

interface UseTableResult<T> {
  // Data
  displayData: T[];
  
  // Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  
  // Filter
  filters: Record<string, any>;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  
  // Sort
  sortBy: keyof T | null;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: keyof T) => void;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  
  // Selection
  selectedRows: string[];
  toggleRow: (id: string) => void;
  toggleAll: () => void;
  isSelected: (id: string) => boolean;
  isAllSelected: boolean;
  clearSelection: () => void;
}

/**
 * Comprehensive hook for table functionality
 * Combines search, filter, sort, pagination, and selection
 */
export const useTable = <T extends { _id: string }>(
  data: T[],
  options: UseTableOptions<T> = {}
): UseTableResult<T> => {
  const { searchableFields = [], initialPageSize = DEFAULT_PAGE_SIZE } = options;
  
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Apply filtering first
  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    clearFilters,
  } = useFilter(data, searchableFields);

  // Then apply sorting
  const { sortedData, sortBy, sortOrder, handleSort } = useSort(filteredData);

  // Finally apply pagination
  const {
    paginatedData: displayData,
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    hasNextPage,
    hasPreviousPage,
  } = usePagination(sortedData, { initialPageSize });

  // Selection handlers
  const toggleRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(displayData.map(row => row._id));
    }
  };

  const isSelected = (id: string) => selectedRows.includes(id);

  const isAllSelected = useMemo(
    () => displayData.length > 0 && displayData.every(row => selectedRows.includes(row._id)),
    [displayData, selectedRows]
  );

  const clearSelection = () => setSelectedRows([]);

  return {
    displayData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    clearFilters,
    sortBy,
    sortOrder,
    handleSort,
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    hasNextPage,
    hasPreviousPage,
    selectedRows,
    toggleRow,
    toggleAll,
    isSelected,
    isAllSelected,
    clearSelection,
  };
};
