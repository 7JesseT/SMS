import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Container,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
  People as GuardianIcon,
  Photo as PhotoIcon,
  Assessment as GradesIcon,
} from '@mui/icons-material';
import { useStudentDetails, useUpdateStudentProfile } from '../../services/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: student, isLoading, error: fetchError } = useStudentDetails(user?.id);
  const updateProfile = useUpdateStudentProfile();
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleViewGrades = () => {
    navigate('/student/exam-results');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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

  if (!student) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error">
            {fetchError instanceof Error ? fetchError.message : 'Failed to load student details'}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header with Back and Logout */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/student/dashboard')}
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

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            My Profile
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate('/student/profile/edit')}
          >
            Edit Profile
          </Button>
        </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Profile Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="start" gap={3} mb={4}>
                <Avatar
                  src={student.photo || undefined}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    bgcolor: 'primary.main', 
                    fontSize: '3rem' 
                  }}
                >
                  {!student.photo && student.name.charAt(0).toUpperCase()}
                </Avatar>
                
                <Box flex={1}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {student.name}
                  </Typography>
                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Chip 
                      icon={<PersonIcon />}
                      label={`Roll No: ${student.rollNum}`} 
                      color="primary" 
                    />
                    <Chip 
                      label={student.role} 
                      color="success" 
                    />
                    {student.sclassName && (
                      <Chip 
                        label={student.sclassName.sclassName} 
                        color="info" 
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {student.school?.schoolName || 'School'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Personal Information */}
              <Typography variant="h6" fontWeight="bold" gutterBottom mb={2}>
                Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CalendarIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Date of Birth
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {student.dateOfBirth 
                      ? format(new Date(student.dateOfBirth), 'MMMM dd, yyyy')
                      : 'Not provided'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <HomeIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {student.address || 'Not provided'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <GuardianIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Guardian Name
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {student.guardianName || 'Not provided'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PersonIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Student ID
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium" sx={{ wordBreak: 'break-all' }}>
                    {student._id}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Academic Information */}
              <Typography variant="h6" fontWeight="bold" gutterBottom mb={2}>
                Academic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Class
                    </Typography>
                    <Typography variant="h6" fontWeight="medium" color="primary.main">
                      {student.sclassName?.sclassName || 'Not assigned'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Exam Results
                    </Typography>
                    <Typography variant="h6" fontWeight="medium" color="success.main">
                      {student.examResult?.length || 0}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Attendance Records
                    </Typography>
                    <Typography variant="h6" fontWeight="medium" color="info.main">
                      {student.attendance?.length || 0}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box mt={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<GradesIcon />}
                  onClick={handleViewGrades}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  View Exam Results
                </Button>
              </Box>
            </CardContent>
          </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
