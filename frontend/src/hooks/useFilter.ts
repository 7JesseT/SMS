import { useState, useMemo } from 'react';

interface FilterResult<T> {
  filteredData: T[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Record<string, any>;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
}

/**
 * Custom hook for filtering data
 */
export const useFilter = <T extends Record<string, any>>(
  data: T[],
  searchableFields: (keyof T)[] = []
): FilterResult<T> => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search filter
    if (searchTerm && searchableFields.length > 0) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchableFields.some(field => {
          const value = item[field];
          if (value == null) return false;
          
          // Handle nested objects
          if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(nestedValue =>
              String(nestedValue).toLowerCase().includes(lowerSearchTerm)
            );
          }
          
          return String(value).toLowerCase().includes(lowerSearchTerm);
        })
      );
    }

    // Apply custom filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value != null) {
        result = result.filter(item => {
          const itemValue = item[key];
          
          // Handle nested objects
          if (typeof itemValue === 'object' && itemValue !== null) {
            return Object.values(itemValue).some(nestedValue =>
              String(nestedValue) === String(value)
            );
          }
          
          return String(itemValue) === String(value);
        });
      }
    });

    return result;
  }, [data, searchTerm, filters, searchableFields]);

  const setFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
  };

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    clearFilters,
  };
};
