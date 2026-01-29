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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { teacherApi } from '../../services/teacherApi';

const ReportAttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    presentCount: '',
    absentCount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get user from localStorage
  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');

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

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        {/* Header with Back and Logout */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/teacher/dashboard')}
          >
            Back to Dashboard
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

        <Typography variant="h4" fontWeight="bold" mb={3}>
          Report Attendance
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Attendance submitted successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Daily Attendance Report
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  fullWidth
                  label="Date"
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
                />

                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="Present Count"
                    name="presentCount"
                    type="number"
                    value={formData.presentCount}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                    inputProps={{
                      min: 0,
                    }}
                    helperText="Number of students present"
                  />

                  <TextField
                    fullWidth
                    label="Absent Count"
                    name="absentCount"
                    type="number"
                    value={formData.absentCount}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                    inputProps={{
                      min: 0,
                    }}
                    helperText="Number of students absent"
                  />
                </Box>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Students
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {(parseInt(formData.presentCount) || 0) + (parseInt(formData.absentCount) || 0)}
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  fullWidth
                  size="large"
                  disabled={loading || success}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {loading ? 'Submitting...' : 'Submit Attendance'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ReportAttendancePage;
