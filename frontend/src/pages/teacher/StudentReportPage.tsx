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
  CircularProgress,
  Alert,
  Autocomplete,
  Card,
  CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Download, Print } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Student } from '../../types/student.types';
import { format } from 'date-fns';

export const StudentReportPage: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
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

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Student Report</Typography>
        {studentDetails && (
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<Print />} onClick={handlePrint}>
              Print
            </Button>
            <Button variant="contained" startIcon={<Download />} onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Autocomplete
          options={students}
          getOptionLabel={(option) => `${option.name} (Roll No: ${option.rollNum})`}
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
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Student Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {studentDetails.name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Roll Number
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {studentDetails.rollNum}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Class
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {studentDetails.sclassName?.sclassName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    School
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {studentDetails.school || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
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
                  <Typography variant="h6" color="primary">
                    {calculateOverallPerformance().grade}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
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
                            <TableCell>{calculateGrade(percentage)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary">No exam results available</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};
