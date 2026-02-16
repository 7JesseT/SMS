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
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material';
import Grid from "@mui/material/Grid";
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
  School as SchoolIcon,
  ContactMail as ContactIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useStudentDetails, useUpdateStudentProfile } from '../../services/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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

  // Info Card Component for better reusability
  const InfoCard = ({ icon, label, value, color = 'primary' }: any) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: `${color}.main`,
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1.5,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Box>
      <Typography 
        variant="body1" 
        fontWeight={600} 
        color="text.primary"
        sx={{ ml: 0.5, wordBreak: 'break-word' }}
      >
        {value || 'Not provided'}
      </Typography>
    </Paper>
  );

  // Stat Card Component for academic stats
  const StatCard = ({ icon, label, value, color = 'primary' }: any) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: `${color}.main`,
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1.5,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Box>
      <Typography 
        variant="h6" 
        fontWeight={700} 
        color={`${color}.main`}
        sx={{ ml: 0.5 }}
      >
        {value}
      </Typography>
    </Paper>
  );

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
            Loading profile...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {fetchError instanceof Error ? fetchError.message : 'Failed to load student details'}
          </Alert>
        </Container>
      </Box>
    );
  }

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
              onClick={() => navigate('/student/dashboard')}
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

          <Stack
            direction={isSmallScreen ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isSmallScreen ? 'flex-start' : 'center'}
            spacing={2}
          >
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              My Profile
            </Typography>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate('/student/profile/edit')}
              sx={{
                bgcolor: 'warning.main',
                color: 'warning.contrastText',
                fontWeight: 600,
                px: 3,
                py: 1.2,
                boxShadow: theme.shadows[8],
                '&:hover': {
                  bgcolor: 'warning.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[12],
                },
              }}
            >
              Edit Profile
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setSuccess('')}
          >
            {success}
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

        {/* Main Profile Card with Elevation */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Profile Header Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'start' },
                gap: 3,
                mb: 4,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={student.photo || undefined}
                  sx={{
                    width: { xs: 120, sm: 140, md: 160 },
                    height: { xs: 120, sm: 140, md: 160 },
                    bgcolor: 'primary.main',
                    fontSize: '3.5rem',
                    border: '4px solid',
                    borderColor: 'background.paper',
                    boxShadow: theme.shadows[8],
                  }}
                >
                  {!student.photo && student.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    bgcolor: 'success.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid',
                    borderColor: 'background.paper',
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} />
                </Box>
              </Box>

              <Box flex={1} textAlign={{ xs: 'center', sm: 'left' }}>
                <Typography
                  variant={isMobile ? 'h5' : 'h4'}
                  fontWeight="bold"
                  gutterBottom
                  color="text.primary"
                >
                  {student.name}
                </Typography>
                
                <Stack
                  direction="row"
                  spacing={1}
                  mb={2}
                  flexWrap="wrap"
                  justifyContent={{ xs: 'center', sm: 'flex-start' }}
                  sx={{ gap: 1 }}
                >
                  <Chip
                    icon={<PersonIcon />}
                    label={`Roll No: ${student.rollNum}`}
                    sx={{
                      bgcolor: 'warning.main',
                      color: 'warning.contrastText',
                      fontWeight: 600,
                      px: 1,
                    }}
                  />
                  <Chip
                    label={student.role}
                    sx={{
                      bgcolor: 'success.main',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  {student.sclassName && (
                    <Chip
                      label={student.sclassName.sclassName}
                      sx={{
                        bgcolor: 'info.main',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Stack>

                <Box display="flex" alignItems="center" gap={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                  <SchoolIcon color="action" fontSize="small" />
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    {student.school?.schoolName || 'School'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Personal Information Section */}
            <Box mb={4}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                mb={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <ContactIcon color="primary" />
                Personal Information
              </Typography>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <InfoCard
                    icon={<CalendarIcon fontSize="small" />}
                    label="Date of Birth"
                    value={
                      student.dateOfBirth
                        ? format(new Date(student.dateOfBirth), 'MMMM dd, yyyy')
                        : 'Not provided'
                    }
                    color="info"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <InfoCard
                    icon={<HomeIcon fontSize="small" />}
                    label="Address"
                    value={student.address}
                    color="success"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <InfoCard
                    icon={<GuardianIcon fontSize="small" />}
                    label="Guardian Name"
                    value={student.guardianName}
                    color="warning"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <InfoCard
                    icon={<PersonIcon fontSize="small" />}
                    label="Student ID"
                    value={student._id}
                    color="primary"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Academic Information Section */}
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                mb={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <TrendingUpIcon color="primary" />
                Academic Information
              </Typography>
              <Grid container spacing={2.5} mb={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <StatCard
                    icon={<SchoolIcon sx={{ fontSize: 28 }} />}
                    label="Current Class"
                    value={student.sclassName?.sclassName || 'N/A'}
                    color="primary"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <StatCard
                    icon={<GradesIcon sx={{ fontSize: 28 }} />}
                    label="Exam Results"
                    value={student.examResult?.length || 0}
                    color="success"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <StatCard
                    icon={<CheckCircleIcon sx={{ fontSize: 28 }} />}
                    label="Attendance Records"
                    value={student.attendance?.length || 0}
                    color="info"
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                startIcon={<GradesIcon />}
                onClick={handleViewGrades}
                fullWidth
                sx={{
                  py: 1.8,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                View Detailed Exam Results
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
