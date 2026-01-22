import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface Action<T> {
  icon: React.ReactElement;
  label: string;
  onClick: (row: T) => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  onSort?: (column: keyof T | string, direction: 'asc' | 'desc') => void;
  sortColumn?: keyof T | string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  selectable?: boolean;
  selected?: string[];
  onSelectionChange?: (selected: string[]) => void;
  getRowId?: (row: T) => string;
  emptyMessage?: string;
  stickyHeader?: boolean;
  dense?: boolean;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  actions,
  onSort,
  sortColumn,
  sortDirection = 'asc',
  page = 0,
  rowsPerPage = 10,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  selectable = false,
  selected = [],
  onSelectionChange,
  getRowId = (row) => row.id || row._id,
  emptyMessage = 'No data available',
  stickyHeader = true,
  dense = false,
}: DataTableProps<T>) {
  const handleSort = (column: keyof T | string) => {
    if (onSort && columns.find(col => col.id === column)?.sortable !== false) {
      const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(column, newDirection);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectionChange) {
      if (event.target.checked) {
        onSelectionChange(data.map(getRowId));
      } else {
        onSelectionChange([]);
      }
    }
  };

  const handleSelectOne = (id: string) => {
    if (onSelectionChange) {
      const selectedIndex = selected.indexOf(id);
      let newSelected: string[] = [];

      if (selectedIndex === -1) {
        newSelected = [...selected, id];
      } else {
        newSelected = selected.filter(item => item !== id);
      }

      onSelectionChange(newSelected);
    }
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const getValue = (row: T, columnId: keyof T | string): any => {
    if (typeof columnId === 'string' && columnId.includes('.')) {
      return columnId.split('.').reduce((obj, key) => obj?.[key], row);
    }
    return row[columnId as keyof T];
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader={stickyHeader} size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sx={{ fontWeight: 600 }}
                >
                  {column.sortable !== false && onSort ? (
                    <TableSortLabel
                      active={sortColumn === column.id}
                      direction={sortColumn === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions && actions.length > 0 && (
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  align="center"
                >
                  <Box py={4}>
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const rowId = getRowId(row);
                const isItemSelected = isSelected(rowId);

                return (
                  <TableRow
                    hover
                    key={rowId}
                    selected={isItemSelected}
                    sx={{ cursor: selectable ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleSelectOne(rowId)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      const value = getValue(row, column.id);
                      return (
                        <TableCell key={String(column.id)} align={column.align || 'left'}>
                          {column.format ? column.format(value, row) : value}
                        </TableCell>
                      );
                    })}
                    {actions && actions.length > 0 && (
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          {actions.map((action, index) => (
                            <Tooltip key={index} title={action.label}>
                              <IconButton
                                size="small"
                                color={action.color || 'default'}
                                onClick={() => action.onClick(row)}
                              >
                                {action.icon}
                              </IconButton>
                            </Tooltip>
                          ))}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {onPageChange && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={totalRows || data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(event) => {
            if (onRowsPerPageChange) {
              onRowsPerPageChange(parseInt(event.target.value, 10));
            }
          }}
        />
      )}
    </Paper>
  );
}

export default DataTable;
