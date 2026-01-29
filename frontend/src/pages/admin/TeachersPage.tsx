import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import {
  DataTable,
  SearchBar,
  FormDialog,
  ConfirmDialog,
  FormField,
  SelectField,
  DateField,
} from '../../components/common';
import type { Column, Action } from '../../components/common/DataDisplay/DataTable';
import type { Teacher } from '../../types';
import { mockTeachers } from '../../data/mockTeachers';
import { mockSubjects } from '../../data/mockSubjects';
import { useTable } from '../../hooks/useTable';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const teacherSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  gender: yup.string().required('Gender is required'),
  contactNumber: yup.string().required('Contact number is required'),
  qualification: yup.string().required('Qualification is required'),
  experience: yup.number().required('Experience is required'),
});

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    sortColumn,
    sortDirection,
    handleSort,
  } = useTable();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(teacherSchema),
  });

  const filteredTeachers = useMemo(() => {
    let result = teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Teacher];
        const bValue = b[sortColumn as keyof Teacher];
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [teachers, searchTerm, sortColumn, sortDirection]);

  const paginatedTeachers = filteredTeachers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns: Column<Teacher>[] = [
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 180 },
    { id: 'gender', label: 'Gender', minWidth: 80 },
    { id: 'qualification', label: 'Qualification', minWidth: 120 },
    { id: 'experience', label: 'Experience', minWidth: 100, format: (value) => `${value} years` },
  ];

  const actions: Action<Teacher>[] = [
    { icon: <Edit />, label: 'Edit', onClick: (t) => { setSelectedTeacher(t); reset(t); setOpenForm(true); }, color: 'primary' },
    { icon: <Delete />, label: 'Delete', onClick: (t) => { setSelectedTeacher(t); setOpenDelete(true); }, color: 'error' },
  ];

  const handleSave = (data: any) => {
    if (selectedTeacher) {
      setTeachers(teachers.map(t => t._id === selectedTeacher._id ? { ...t, ...data } : t));
    } else {
      setTeachers([...teachers, { _id: `t-${Date.now()}`, ...data, school: 'school-1', role: 'Teacher', teachSubject: [], teachSclass: [], attendance: [] }]);
    }
    setOpenForm(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Teachers Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { reset({}); setOpenForm(true); }}>Add Teacher</Button>
      </Box>
      <Box sx={{ mb: 3 }}><SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search teachers..." /></Box>
      <DataTable columns={columns} data={paginatedTeachers} actions={actions} sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} page={page} rowsPerPage={rowsPerPage} totalRows={filteredTeachers.length} onPageChange={setPage} onRowsPerPageChange={setRowsPerPage} />
      <FormDialog open={openForm} title={selectedTeacher ? 'Edit Teacher' : 'Add Teacher'} onClose={() => setOpenForm(false)} onSubmit={handleSubmit(handleSave)}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}><FormField name="name" control={control} label="Name" /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><FormField name="email" control={control} label="Email" /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><SelectField name="gender" control={control} label="Gender" options={[{value:'Male',label:'Male'},{value:'Female',label:'Female'}]} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><FormField name="contactNumber" control={control} label="Contact" /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><FormField name="qualification" control={control} label="Qualification" /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><FormField name="experience" control={control} label="Experience (years)" type="number" /></Grid>
        </Grid>
      </FormDialog>
      <ConfirmDialog open={openDelete} title="Delete Teacher" message={`Delete ${selectedTeacher?.name}?`} onConfirm={() => { setTeachers(teachers.filter(t => t._id !== selectedTeacher?._id)); setOpenDelete(false); }} onCancel={() => setOpenDelete(false)} confirmColor="error" />
    </Box>
  );
};

export default TeachersPage;
