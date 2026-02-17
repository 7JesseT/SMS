import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Container,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  Subject as SubjectIcon,
  CalendarToday as CalendarIcon,
  Assessment as AttendanceIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { teacherApi } from '../../services/teacherApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface TeacherDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  school: any;
  teachSubject: any;
  teachSclass: any;
  attendance: any[];
  createdAt: string;
  updatedAt: string;
}

const TeacherProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [teacher, setTeacher] = useState<TeacherDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user from localStorage
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');

  useEffect(() => {
    fetchTeacherDetails();
  }, []);

  const fetchTeacherDetails = async () => {
    if (!authUser?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await teacherApi.getDetails(authUser.id);
      setTeacher(response.data);
    } catch (err: any) {
      console.error('Error fetching teacher details:', err);
      setError('Failed to load teacher details');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
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

  if (loading) {
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

  if (!teacher) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error || 'Failed to load teacher details'}
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

          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
            Teacher Profile
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
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
                  {teacher.name.charAt(0).toUpperCase()}
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
                  <PersonIcon sx={{ fontSize: 14, color: 'white' }} />
                </Box>
              </Box>

              <Box flex={1} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" gutterBottom>
                  {teacher.name}
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={1} 
                  mb={2}
                  justifyContent={{ xs: 'center', sm: 'flex-start' }}
                  flexWrap="wrap"
                >
                  <Chip 
                    icon={<EmailIcon />}
                    label={teacher.email} 
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  />
                  <Chip 
                    label={teacher.role} 
                    color="success"
                    sx={{ fontWeight: 500 }}
                  />
                </Stack>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Teacher Information Grid */}
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              Personal Information
            </Typography>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoCard
                  icon={<PersonIcon />}
                  label="Teacher ID"
                  value={teacher._id.substring(0, 8) + '...'}
                  color="primary"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoCard
                  icon={<EmailIcon />}
                  label="Email Address"
                  value={teacher.email}
                  color="info"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoCard
                  icon={<SubjectIcon />}
                  label="Teaching Subject"
                  value={teacher.teachSubject?.subName || 'Not assigned'}
                  color="success"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoCard
                  icon={<ClassIcon />}
                  label="Teaching Class"
                  value={teacher.teachSclass?.sclassName || 'Not assigned'}
                  color="warning"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoCard
                  icon={<AttendanceIcon />}
                  label="Attendance Records"
                  value={teacher.attendance?.length || 0}
                  color="error"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <InfoCard
                  icon={<CalendarIcon />}
                  label="Member Since"
                  value={new Date(teacher.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  color="secondary"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TeacherProfilePage;
