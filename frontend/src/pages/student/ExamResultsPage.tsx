import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useStudentDetails } from '../../services/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const ExamResultsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: student, isLoading, error } = useStudentDetails(user?.id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const calculatePercentage = (obtained: number, total: number): number => {
    return total > 0 ? (obtained / total) * 100 : 0;
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const getGradeColor = (grade: string): 'success' | 'primary' | 'warning' | 'error' => {
    if (['A+', 'A'].includes(grade)) return 'success';
    if (['B+', 'B'].includes(grade)) return 'primary';
    if (['C', 'D'].includes(grade)) return 'warning';
    return 'error';
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error || !student) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error">
            {error instanceof Error ? error.message : 'Failed to load exam results'}
          </Alert>
        </Container>
      </Box>
    );
  }

  const examResults = student.examResult || [];

  // Calculate overall statistics
  const totalExams = examResults.length;
  const totalMarks = examResults.reduce((sum, result) => sum + result.marksObtained, 0);
  const totalPossibleMarks = examResults.reduce((sum, result) => sum + result.totalMarks, 0);
  const overallPercentage = calculatePercentage(totalMarks, totalPossibleMarks);
  const overallGrade = getGrade(overallPercentage);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/student/profile')}
          >
            Back to Profile
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Exam Results
          </Typography>
        </Box>

        {/* Overall Statistics */}
        {totalExams > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Overall Performance
              </Typography>
              <Box display="flex" gap={4} flexWrap="wrap" mt={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Exams
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    {totalExams}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Marks
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {totalMarks} / {totalPossibleMarks}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Overall Percentage
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    {overallPercentage.toFixed(2)}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Overall Grade
                  </Typography>
                  <Chip
                    label={overallGrade}
                    color={getGradeColor(overallGrade)}
                    size="medium"
                    sx={{ fontSize: '1.2rem', fontWeight: 'bold', px: 2, py: 2.5 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Exam Results Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {examResults.length === 0 ? (
              <Box p={4} textAlign="center">
                <Typography variant="h6" color="text.secondary">
                  No exam results available yet
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Subject</strong></TableCell>
                      <TableCell><strong>Exam Name</strong></TableCell>
                      <TableCell align="center"><strong>Marks Obtained</strong></TableCell>
                      <TableCell align="center"><strong>Total Marks</strong></TableCell>
                      <TableCell align="center"><strong>Percentage</strong></TableCell>
                      <TableCell align="center"><strong>Grade</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {examResults.map((result, index) => {
                      const percentage = calculatePercentage(
                        result.marksObtained,
                        result.totalMarks
                      );
                      const grade = getGrade(percentage);

                      return (
                        <TableRow key={result._id || index} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {result.subName?.subName || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {result.examName}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="bold" color="primary.main">
                              {result.marksObtained}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {result.totalMarks}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="medium">
                              {percentage.toFixed(2)}%
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={grade}
                              color={getGradeColor(grade)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(result.date), 'MMM dd, yyyy')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ExamResultsPage;
