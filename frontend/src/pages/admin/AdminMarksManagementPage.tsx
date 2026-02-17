import React, { useState } from 'react';
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
  Snackbar,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  Edit, 
  Download, 
  Print,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Assessment as MarksIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  useAdminStudents,
  useAdminStudentDetails,
  useAdminUpdateExamResult,
  getApiErrorMessage,
} from '../../hooks/useAdminApi';
import type { Student, ExamResult } from '../../types/student.types';
import { format } from 'date-fns';

export const AdminMarksManagementPage: React.FC = () => {
  const { user, getCurrentUserData, logout } = useAuth() as any;
  const currentUserData = getCurrentUserData();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // For Admin users, the _id IS the school ID
  const schoolId = currentUserData?._id;

  // TanStack Query hooks
  const { data: students = [], isLoading: loadingStudents, error: studentsError } = useAdminStudents(schoolId);
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined);
  const { data: studentDetails, isLoading: loadingDetails, error: detailsError } = useAdminStudentDetails(selectedStudentId);
  const updateResultMutation = useAdminUpdateExamResult();

  // Local UI state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);
  const [editFormData, setEditFormData] = useState({ marksObtained: 0, totalMarks: 100 });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStudentSelect = (student: Student | null) => {
    setSelectedStudent(student);
    setSelectedStudentId(student?._id);
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
    if (!selectedStudentId || !editingResult) return;

    try {
      await updateResultMutation.mutateAsync({
        studentId: selectedStudentId,
        subName: editingResult.subName._id,
        marksObtained: editFormData.marksObtained,
      });
      showSnackbar('Marks updated successfully!', 'success');
      setEditDialogOpen(false);
    } catch (err: any) {
      showSnackbar(getApiErrorMessage(err, 'Failed to update marks. Please try again.'), 'error');
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

  const isUpdating = updateResultMutation.isPending;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header with Gradient */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 6,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/dashboard')}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Dashboard
            </Button>
            <Stack direction="row" spacing={2}>
              {studentDetails && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<Print />}
                    onClick={() => window.print()}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Print
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => window.print()}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    Download
                  </Button>
                </>
              )}
              <Button
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <MarksIcon sx={{ fontSize: 40 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              Student Marks Management
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {studentsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {getApiErrorMessage(studentsError, 'Failed to load students list')}
          </Alert>
        )}

        {detailsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {getApiErrorMessage(detailsError, 'Failed to load student details')}
          </Alert>
        )}

        {/* Search Student Card */}
        <Card
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <PersonIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Search Student
            </Typography>
          </Stack>
          <Autocomplete
            options={students}
            loading={loadingStudents}
            getOptionLabel={(option) =>
              `${option.name} - Roll No: ${option.rollNum} (${option.sclassName?.sclassName || 'N/A'})`
            }
            value={selectedStudent}
            onChange={(_, newValue) => handleStudentSelect(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Student"
                placeholder="Start typing to search..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingStudents ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            fullWidth
          />
        </Card>

        {loadingDetails && (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        )}

        {studentDetails && !loadingDetails && (
          <Box id="report-content">
            {/* Student Information Card */}
            <Card
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={3}>Student Information</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="body2" color="text.secondary" mb={1}>Name</Typography>
                  <Typography variant="body1" fontWeight="medium">{studentDetails.name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="body2" color="text.secondary" mb={1}>Roll Number</Typography>
                  <Typography variant="body1" fontWeight="medium">{studentDetails.rollNum}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="body2" color="text.secondary" mb={1}>Class</Typography>
                  <Typography variant="body1" fontWeight="medium">{studentDetails.sclassName?.sclassName || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="body2" color="text.secondary" mb={1}>Guardian Name</Typography>
                  <Typography variant="body1" fontWeight="medium">{studentDetails.guardianName || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </Card>

            {/* Overall Performance Card */}
            <Card
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={3}>Overall Performance</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: 'primary.lighter',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" mb={1}>Total Marks</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      {calculateOverallPerformance().totalMarks}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: 'success.lighter',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" mb={1}>Obtained Marks</Typography>
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      {calculateOverallPerformance().obtainedMarks}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: 'info.lighter',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" mb={1}>Average</Typography>
                    <Typography variant="h5" fontWeight="bold" color="info.main">
                      {calculateOverallPerformance().average}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: 'warning.lighter',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" mb={1}>Grade</Typography>
                    <Chip 
                      label={calculateOverallPerformance().grade} 
                      color="primary" 
                      sx={{ fontSize: '1.1rem', fontWeight: 'bold', mt: 1 }} 
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Card>

            {/* Exam Results Card */}
            <Card
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={3}>Exam Results</Typography>
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
                              <IconButton color="primary" size="small" onClick={() => handleEditClick(result)} title="Edit marks">
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
                <Box textAlign="center" py={4}>
                  <MarksIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">No exam results available for this student.</Typography>
                </Box>
              )}
            </Card>
          </Box>
        )}
      </Container>

      {/* Edit Marks Dialog */}
      <Dialog open={editDialogOpen} onClose={() => !isUpdating && setEditDialogOpen(false)} maxWidth="sm" fullWidth>
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
                onChange={(e) => setEditFormData((prev) => ({ ...prev, marksObtained: Number(e.target.value) }))}
                inputProps={{ min: 0, max: editFormData.totalMarks }}
                disabled={isUpdating}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Total Marks"
                type="number"
                value={editFormData.totalMarks}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, totalMarks: Number(e.target.value) }))}
                inputProps={{ min: 1 }}
                disabled={isUpdating}
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
          <Button onClick={() => setEditDialogOpen(false)} disabled={isUpdating}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary" disabled={isUpdating}>
            {isUpdating ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
