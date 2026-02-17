import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  AssignmentTurnedIn as AttendanceIcon,
  People as PeopleIcon,
  PersonOff as AbsentIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { teacherApi } from '../../services/teacherApi';
import { useAuth } from '../../context/AuthContext';

const ReportAttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    date: '',
    presentCount: '',
    absentCount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get user from localStorage
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');

  // AttendanceCard component for attendance inputs
  const AttendanceCard = ({ icon, label, value, onChange, color = 'primary', name }: any) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 3,
        border: '2px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: `${color}.main`,
          boxShadow: theme.shadows[6],
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={2.5}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" color="text.primary" fontWeight={600}>
          {label}
        </Typography>
      </Box>
      <TextField
        fullWidth
        name={name}
        type="number"
        value={value}
        onChange={onChange}
        required
        disabled={loading || success}
        inputProps={{
          min: 0,
        }}
        placeholder="0"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            fontSize: '1.25rem',
            fontWeight: 600,
            '& input': {
              textAlign: 'center',
            },
          },
        }}
      />
    </Paper>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.date || !formData.presentCount || !formData.absentCount) {
      setError('All fields are required');
      return;
    }

    // Date validation - cannot be in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setError('Cannot report attendance for future dates');
      return;
    }

    // Validate numbers
    const present = parseInt(formData.presentCount);
    const absent = parseInt(formData.absentCount);

    if (isNaN(present) || present < 0) {
      setError('Present count must be a valid non-negative number');
      return;
    }

    if (isNaN(absent) || absent < 0) {
      setError('Absent count must be a valid non-negative number');
      return;
    }

    if (present === 0 && absent === 0) {
      setError('At least one student must be present or absent');
      return;
    }

    if (!authUser?.id) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      await teacherApi.reportAttendance(authUser.id, {
        date: formData.date,
        presentCount: formData.presentCount,
        absentCount: formData.absentCount,
      });

      setSuccess(true);
      setFormData({
        date: '',
        presentCount: '',
        absentCount: '',
      });

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Attendance submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

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
        <Container maxWidth="md">
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

          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <AttendanceIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
                Report Attendance
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, color: 'white' }}>
                Submit daily attendance records
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md">
        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<CheckCircleIcon />}
            onClose={() => setSuccess(false)}
          >
            Attendance submitted successfully!
          </Alert>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            mb: 3,
          }}
        >
          <Box sx={{ p: 3, bgcolor: theme.palette.primary.main, color: 'white' }}>
            <Typography variant="h6" fontWeight="bold">
              Daily Attendance Report
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Enter the number of present and absent students for today
            </Typography>
          </Box>
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Date Selection */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={2.5}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CalendarIcon sx={{ fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                      Attendance Date
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0],
                    }}
                    helperText="Select the date for this attendance record"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '1.1rem',
                      },
                    }}
                  />
                </Paper>

                {/* Attendance Counts */}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <AttendanceCard
                      icon={<CheckCircleIcon sx={{ fontSize: 28 }} />}
                      label="Present Students"
                      name="presentCount"
                      value={formData.presentCount}
                      onChange={handleChange}
                      color="success"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <AttendanceCard
                      icon={<AbsentIcon sx={{ fontSize: 28 }} />}
                      label="Absent Students"
                      name="absentCount"
                      value={formData.absentCount}
                      onChange={handleChange}
                      color="error"
                    />
                  </Grid>
                </Grid>

                {/* Total Students Summary */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: theme.shadows[6],
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Stack 
                    direction={isSmallScreen ? 'column' : 'row'} 
                    alignItems="center" 
                    spacing={3}
                    justifyContent="space-between"
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: 'primary.lighter',
                          color: 'primary.main',
                          borderRadius: 2,
                          display: 'flex',
                        }}
                      >
                        <PeopleIcon sx={{ fontSize: 40 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500} mb={0.5}>
                          Total Students
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" color="primary.main">
                          {(parseInt(formData.presentCount) || 0) + (parseInt(formData.absentCount) || 0)}
                        </Typography>
                      </Box>
                    </Stack>
                    {formData.presentCount && formData.absentCount && (
                      <Box sx={{ textAlign: isSmallScreen ? 'center' : 'right' }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={500} mb={0.5}>
                          Attendance Rate
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {((parseInt(formData.presentCount) / ((parseInt(formData.presentCount) || 0) + (parseInt(formData.absentCount) || 0))) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>

                {/* Submit Button */}
                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={loading || success}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: '1.15rem',
                      boxShadow: theme.shadows[6],
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: theme.shadows[12],
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        opacity: 0.6,
                      },
                    }}
                  >
                    {loading ? 'Submitting...' : success ? 'Attendance Submitted!' : 'Submit Attendance'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ReportAttendancePage;
