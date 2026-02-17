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
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
      <Box 
        sx={{ 
          minHeight: '100vh', 
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body1" color="text.secondary">
            Loading exam results...
          </Typography>
        </Stack>
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Header Section with Gradient Background */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
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
              onClick={() => navigate('/student/profile')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Back to Profile
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

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <AssessmentIcon sx={{ color: 'white', fontSize: isMobile ? 28 : 32 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              Exam Results
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">

        {/* Overall Statistics */}
        {totalExams > 0 && (
          <Card
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom mb={3}>
                Overall Performance
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                      Total Exams
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {totalExams}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                      Total Marks
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {totalMarks} / {totalPossibleMarks}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                      Overall Percentage
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {overallPercentage.toFixed(2)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                      Overall Grade
                    </Typography>
                    <Chip
                      label={overallGrade}
                      color={getGradeColor(overallGrade)}
                      sx={{ fontSize: '1.2rem', fontWeight: 'bold', px: 1, py: 0.8, height: 'auto' }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Exam Results Table */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {examResults.length === 0 ? (
              <Box p={4} textAlign="center">
                <AssessmentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No exam results available yet
                </Typography>
              </Box>
            ) : (
              <TableContainer>
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
                            <Typography variant="body2" fontWeight={600}>
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
                            <Typography variant="body2" fontWeight={600}>
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
