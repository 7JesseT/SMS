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
  Container,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  Download, 
  Print,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Student } from '../../types/student.types';
import { format } from 'date-fns';

export const StudentReportPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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

  const handleLogout = () => {
    logout();
    navigate('/');
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Header Section with Gradient Background */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
          pt: 3,
          pb: 8,
          mb: -4,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={isSmallScreen ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isSmallScreen ? 'stretch' : 'center'}
            spacing={2}
            mb={3}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/teacher/dashboard')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Dashboard
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'rgba(244,67,54,0.8)',
                  bgcolor: 'rgba(244,67,54,0.1)',
                },
              }}
            >
              Logout
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <AssessmentIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
                  Student Report
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, color: 'white' }}>
                  View detailed student academic performance
                </Typography>
              </Box>
            </Stack>
            {studentDetails && !isSmallScreen && (
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  startIcon={<Print />} 
                  onClick={handlePrint}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Print
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Download />} 
                  onClick={handleDownloadPDF}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    color: theme.palette.info.dark,
                    '&:hover': {
                      bgcolor: 'white',
                    },
                  }}
                >
                  Download
                </Button>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
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
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={60} thickness={4} />
              <Typography variant="body1" color="text.secondary">
                Loading student report...
              </Typography>
            </Stack>
          </Box>
        )}

        {studentDetails && !loading && (
          <Box id="report-content">
            <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
              <Box sx={{ p: 3, bgcolor: theme.palette.primary.main, color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">
                  Student Information
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
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
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
              <Box sx={{ p: 3, bgcolor: theme.palette.success.main, color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">
                  Overall Performance
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.lighter', border: '1px solid', borderColor: 'primary.light' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Marks
                    </Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {calculateOverallPerformance().totalMarks}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'info.lighter', border: '1px solid', borderColor: 'info.light' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Obtained Marks
                    </Typography>
                    <Typography variant="h5" color="info.main" fontWeight="bold">
                      {calculateOverallPerformance().obtainedMarks}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'warning.lighter', border: '1px solid', borderColor: 'warning.light' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Average
                    </Typography>
                    <Typography variant="h5" color="warning.main" fontWeight="bold">
                      {calculateOverallPerformance().average}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'success.lighter', border: '1px solid', borderColor: 'success.light' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Grade
                    </Typography>
                    <Typography variant="h5" color="success.main" fontWeight="bold">
                      {calculateOverallPerformance().grade}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
              <Box sx={{ p: 3, bgcolor: theme.palette.info.main, color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">
                  Exam Results
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
              {studentDetails.examResult && studentDetails.examResult.length > 0 ? (
                <TableContainer>
                  <Table sx={{ '& .MuiTableCell-head': { fontWeight: 'bold', bgcolor: 'grey.50' } }}>
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
                          <TableRow 
                            key={index}
                            sx={{ 
                              '&:hover': { bgcolor: 'action.hover' },
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                          >
                            <TableCell>{result.subName?.subName || 'N/A'}</TableCell>
                            <TableCell>{result.examName}</TableCell>
                            <TableCell>
                              {result.date ? format(new Date(result.date), 'MMM dd, yyyy') : 'N/A'}
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="medium">
                                {result.marksObtained}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">{result.totalMarks}</TableCell>
                            <TableCell align="right">
                              <Typography 
                                variant="body2" 
                                fontWeight="medium"
                                color={percentage >= 70 ? 'success.main' : percentage >= 50 ? 'warning.main' : 'error.main'}
                              >
                                {percentage.toFixed(2)}%
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box 
                                sx={{ 
                                  px: 1.5, 
                                  py: 0.5, 
                                  borderRadius: 1, 
                                  display: 'inline-block',
                                  bgcolor: percentage >= 70 ? 'success.lighter' : percentage >= 50 ? 'warning.lighter' : 'error.lighter',
                                  color: percentage >= 70 ? 'success.main' : percentage >= 50 ? 'warning.main' : 'error.main',
                                  fontWeight: 'bold',
                                  fontSize: '0.875rem'
                                }}
                              >
                                {calculateGrade(percentage)}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" py={5}>
                  <Typography variant="body1" color="text.secondary">
                    No exam results available
                  </Typography>
                </Box>
              )}
              </Box>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};
