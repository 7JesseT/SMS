import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Edit, Download, Print } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Student, ExamResult } from '../../types/student.types';
import { format } from 'date-fns';

export const AdminMarksManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);
  const [editFormData, setEditFormData] = useState({
    marksObtained: 0,
    totalMarks: 100,
  });

  useEffect(() => {
    fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    if (!user?.school) return;

    try {
      const response = await api.get(`/Students/${user.school}`);
      setStudents(response.data);
    } catch (err: any) {
      setError('Failed to load students');
    }
  };

  const fetchStudentDetails = async (studentId: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/Student/${studentId}`);
      setStudentDetails(response.data);
    } catch (err: any) {
      setError('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (student: Student | null) => {
    setSelectedStudent(student);
    if (student) {
      fetchStudentDetails(student._id);
    } else {
      setStudentDetails(null);
    }
  };

  const handleEditClick = (result: ExamResult) => {
    setEditingResult(result);
    setEditFormData({
      marksObtained: result.marksObtained,
      totalMarks: result.totalMarks,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedStudent || !editingResult) return;

    try {
      // Update the marks for the specific exam result
      await api.put(`/UpdateExamResult/${selectedStudent._id}`, {
        subName: editingResult.subName._id,
        marksObtained: editFormData.marksObtained,
      });

      setSuccess('Marks updated successfully');
      setEditDialogOpen(false);
      fetchStudentDetails(selectedStudent._id);
    } catch (err: any) {
      setError('Failed to update marks');
    }
  };

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const calculateOverallPerformance = () => {
    if (!studentDetails?.examResult || studentDetails.examResult.length === 0) {
      return { average: 0, grade: 'N/A', totalMarks: 0, obtainedMarks: 0 };
    }

    const total = studentDetails.examResult.reduce(
      (acc: { obtained: number; total: number }, result: any) => ({
        obtained: acc.obtained + result.marksObtained,
        total: acc.total + result.totalMarks,
      }),
      { obtained: 0, total: 0 }
    );

    const average = (total.obtained / total.total) * 100;
    return {
      average: average.toFixed(2),
      grade: calculateGrade(average),
      totalMarks: total.total,
      obtainedMarks: total.obtained,
    };
  };

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Student Marks Management</Typography>
        {studentDetails && (
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<Print />} onClick={() => window.print()}>
              Print Report
            </Button>
            <Button variant="contained" startIcon={<Download />} onClick={handleDownloadReport}>
              Download Report
            </Button>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Autocomplete
          options={students}
          getOptionLabel={(option) =>
            `${option.name} - Roll No: ${option.rollNum} (${option.sclassName?.sclassName || 'N/A'})`
          }
          value={selectedStudent}
          onChange={(_, newValue) => handleStudentSelect(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Search Student" placeholder="Start typing..." />
          )}
          fullWidth
        />
      </Paper>

      {loading && (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      )}

      {studentDetails && !loading && (
        <Box id="report-content">
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Student Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {studentDetails.name}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Roll Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {studentDetails.rollNum}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Class
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {studentDetails.sclassName?.sclassName || 'N/A'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Guardian Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {studentDetails.guardianName || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Overall Performance
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Marks
                </Typography>
                <Typography variant="h6" color="primary">
                  {calculateOverallPerformance().totalMarks}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Obtained Marks
                </Typography>
                <Typography variant="h6" color="primary">
                  {calculateOverallPerformance().obtainedMarks}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Average
                </Typography>
                <Typography variant="h6" color="primary">
                  {calculateOverallPerformance().average}%
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Grade
                </Typography>
                <Chip
                  label={calculateOverallPerformance().grade}
                  color="primary"
                  sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Exam Results
            </Typography>
            {studentDetails.examResult && studentDetails.examResult.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>Exam Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Marks Obtained</TableCell>
                      <TableCell align="right">Total Marks</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentDetails.examResult.map((result: any, index: number) => {
                      const percentage = (result.marksObtained / result.totalMarks) * 100;
                      return (
                        <TableRow key={index}>
                          <TableCell>{result.subName?.subName || 'N/A'}</TableCell>
                          <TableCell>{result.examName}</TableCell>
                          <TableCell>
                            {result.date ? format(new Date(result.date), 'MMM dd, yyyy') : 'N/A'}
                          </TableCell>
                          <TableCell align="right">{result.marksObtained}</TableCell>
                          <TableCell align="right">{result.totalMarks}</TableCell>
                          <TableCell align="right">{percentage.toFixed(2)}%</TableCell>
                          <TableCell>
                            <Chip label={calculateGrade(percentage)} color="primary" size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton color="primary" size="small" onClick={() => handleEditClick(result)}>
                              <Edit />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">No exam results available</Typography>
            )}
          </Paper>
        </Box>
      )}

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Marks</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Subject: {editingResult?.subName?.subName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exam: {editingResult?.examName}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Marks Obtained"
                type="number"
                value={editFormData.marksObtained}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, marksObtained: Number(e.target.value) }))
                }
                inputProps={{ min: 0, max: editFormData.totalMarks }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Total Marks"
                type="number"
                value={editFormData.totalMarks}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, totalMarks: Number(e.target.value) }))
                }
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2">
                Percentage: {((editFormData.marksObtained / editFormData.totalMarks) * 100).toFixed(2)}%
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
