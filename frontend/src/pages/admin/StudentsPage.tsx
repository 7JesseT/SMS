import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import {
  DataTable,
  SearchBar,
  FormDialog,
  ConfirmDialog,
  EmptyState,
  FormField,
  SelectField,
  DateField,
} from '../../components/common';
import type { Column, Action } from '../../components/common/DataDisplay/DataTable';
import type { Student } from '../../types';
import { mockStudents } from '../../data/mockStudents';
import { mockClasses } from '../../data/mockClasses';
import { useTable } from '../../hooks/useTable';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const studentSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  rollNum: yup.number().required('Roll number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters'),
  sclassName: yup.string().required('Class is required'),
  gender: yup.string().required('Gender is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  contactNumber: yup.string().required('Contact number is required'),
  guardianName: yup.string().required('Guardian name is required'),
  guardianContact: yup.string().required('Guardian contact is required'),
  address: yup.string().required('Address is required'),
});

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
    selected,
    setSelected,
  } = useTable();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      rollNum: 0,
      password: '',
      sclassName: '',
      gender: '',
      dateOfBirth: '',
      contactNumber: '',
      guardianName: '',
      guardianContact: '',
      address: '',
    },
  });

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let result = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNum.toString().includes(searchTerm)
    );

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Student];
        const bValue = b[sortColumn as keyof Student];
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [students, searchTerm, sortColumn, sortDirection]);

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns: Column<Student>[] = [
    { id: 'rollNum', label: 'Roll No', minWidth: 80 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 180 },
    { 
      id: 'sclassName', 
      label: 'Class', 
      minWidth: 120,
      format: (value, row) => {
        const classInfo = mockClasses.find(c => c._id === row.sclassName);
        return classInfo?.sclassName || value;
      }
    },
    { id: 'gender', label: 'Gender', minWidth: 80 },
    {
      id: 'attendance',
      label: 'Attendance',
      minWidth: 120,
      sortable: false,
      format: (value, row) => {
        const total = row.attendance?.length || 0;
        const present = row.attendance?.filter(a => a.status === 'Present').length || 0;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(0) : 0;
        return (
          <Chip 
            label={`${percentage}%`} 
            size="small" 
            color={Number(percentage) >= 75 ? 'success' : 'error'}
          />
        );
      },
    },
  ];

  const actions: Action<Student>[] = [
    {
      icon: <Visibility />,
      label: 'View',
      onClick: (student) => {
        setSelectedStudent(student);
        // Open view dialog
      },
      color: 'info',
    },
    {
      icon: <Edit />,
      label: 'Edit',
      onClick: (student) => {
        setSelectedStudent(student);
        reset(student);
        setOpenForm(true);
      },
      color: 'primary',
    },
    {
      icon: <Delete />,
      label: 'Delete',
      onClick: (student) => {
        setSelectedStudent(student);
        setOpenDelete(true);
      },
      color: 'error',
    },
  ];

  const handleAddStudent = () => {
    reset({
      name: '',
      email: '',
      rollNum: 0,
      password: '',
      sclassName: '',
      gender: '',
      dateOfBirth: '',
      contactNumber: '',
      guardianName: '',
      guardianContact: '',
      address: '',
    });
    setSelectedStudent(null);
    setOpenForm(true);
  };

  const handleSaveStudent = (data: any) => {
    if (selectedStudent) {
      // Update existing student
      setStudents(students.map(s => 
        s._id === selectedStudent._id ? { ...s, ...data } : s
      ));
    } else {
      // Add new student
      const newStudent: Student = {
        _id: `student-${Date.now()}`,
        ...data,
        school: 'school-1',
        role: 'Student' as const,
        examResult: [],
        attendance: [],
      };
      setStudents([...students, newStudent]);
    }
    setOpenForm(false);
  };

  const handleDeleteStudent = () => {
    if (selectedStudent) {
      setStudents(students.filter(s => s._id !== selectedStudent._id));
    }
    setOpenDelete(false);
    setSelectedStudent(null);
  };

  const classOptions = mockClasses.map(c => ({
    value: c._id,
    label: c.sclassName,
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Students Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage student records, attendance, and academic performance
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddStudent}
        >
          Add Student
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search students..."
        />
        {selected.length > 0 && (
          <Chip
            label={`${selected.length} selected`}
            onDelete={() => setSelected([])}
            color="primary"
          />
        )}
      </Box>

      <DataTable
        columns={columns}
        data={paginatedStudents}
        actions={actions}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={filteredStudents.length}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
        emptyMessage="No students found"
      />

      {/* Add/Edit Student Form */}
      <FormDialog
        open={openForm}
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit(handleSaveStudent)}
        maxWidth="md"
      >
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormField name="name" control={control} label="Full Name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField name="email" control={control} label="Email" type="email" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField name="rollNum" control={control} label="Roll Number" type="number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectField 
              name="sclassName" 
              control={control} 
              label="Class" 
              options={classOptions}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectField 
              name="gender" 
              control={control} 
              label="Gender" 
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateField name="dateOfBirth" control={control} label="Date of Birth" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField name="contactNumber" control={control} label="Contact Number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField 
              name="password" 
              control={control} 
              label="Password" 
              type="password"
              placeholder={selectedStudent ? "Leave blank to keep current" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField name="guardianName" control={control} label="Guardian Name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField name="guardianContact" control={control} label="Guardian Contact" />
          </Grid>
          <Grid item xs={12}>
            <FormField 
              name="address" 
              control={control} 
              label="Address" 
              multiline 
              rows={2}
            />
          </Grid>
        </Grid>
      </FormDialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={openDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteStudent}
        onCancel={() => setOpenDelete(false)}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

export default StudentsPage;
