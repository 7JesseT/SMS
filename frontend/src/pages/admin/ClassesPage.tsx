import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { DataTable, SearchBar, FormDialog, ConfirmDialog, FormField } from '../../components/common';
import type { Column, Action } from '../../components/common/DataDisplay/DataTable';
import type { SClass } from '../../types';
import { mockClasses } from '../../data/mockClasses';
import { useTable } from '../../hooks/useTable';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({ sclassName: yup.string().required('Class name required') });

const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<SClass[]>(mockClasses);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<SClass | null>(null);
  const { searchTerm, setSearchTerm, page, rowsPerPage, setPage, setRowsPerPage, sortColumn, sortDirection, handleSort } = useTable();
  const { control, handleSubmit, reset } = useForm({ resolver: yupResolver(schema) });

  const filtered = useMemo(() => {
    let result = classes.filter(c => c.sclassName.toLowerCase().includes(searchTerm.toLowerCase()));
    if (sortColumn) result.sort((a, b) => {
      const aVal = a[sortColumn as keyof SClass];
      const bVal = b[sortColumn as keyof SClass];
      return aVal < bVal ? (sortDirection === 'asc' ? -1 : 1) : aVal > bVal ? (sortDirection === 'asc' ? 1 : -1) : 0;
    });
    return result;
  }, [classes, searchTerm, sortColumn, sortDirection]);

  const paginated = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const columns: Column<SClass>[] = [{ id: 'sclassName', label: 'Class', minWidth: 150 }, { id: 'description', label: 'Description', minWidth: 300 }];
  const actions: Action<SClass>[] = [
    { icon: <Edit />, label: 'Edit', onClick: (c) => { setSelected(c); reset(c); setOpenForm(true); }, color: 'primary' },
    { icon: <Delete />, label: 'Delete', onClick: (c) => { setSelected(c); setOpenDelete(true); }, color: 'error' },
  ];

  const handleSave = (data: any) => {
    if (selected) {
      setClasses(classes.map(c => c._id === selected._id ? { ...c, ...data } : c));
    } else {
      setClasses([...classes, { _id: `c-${Date.now()}`, ...data, school: 'school-1' }]);
    }
    setOpenForm(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Classes</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { reset({}); setOpenForm(true); }}>Add Class</Button>
      </Box>
      <Box sx={{ mb: 3 }}><SearchBar value={searchTerm} onChange={setSearchTerm} /></Box>
      <DataTable columns={columns} data={paginated} actions={actions} sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} page={page} rowsPerPage={rowsPerPage} totalRows={filtered.length} onPageChange={setPage} onRowsPerPageChange={setRowsPerPage} />
      <FormDialog open={openForm} title={selected ? 'Edit' : 'Add'} onClose={() => setOpenForm(false)} onSubmit={handleSubmit(handleSave)}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}><FormField name="sclassName" control={control} label="Class Name" /></Grid>
          <Grid size={{ xs: 12 }}><FormField name="description" control={control} label="Description" multiline rows={3} /></Grid>
        </Grid>
      </FormDialog>
      <ConfirmDialog open={openDelete} title="Delete" message={`Delete ${selected?.sclassName}?`} onConfirm={() => { setClasses(classes.filter(c => c._id !== selected?._id)); setOpenDelete(false); }} onCancel={() => setOpenDelete(false)} confirmColor="error" />
    </Box>
  );
};

export default ClassesPage;
