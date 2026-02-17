import React, { useState } from 'react';
import {
  Box,
  Typography,
  CardContent,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  Logout as LogoutIcon,
  Subject as SubjectIcon,
  AssignmentTurnedIn as AttendanceIcon,
  Assessment as AssessmentIcon,
  CalendarMonth as CalendarIcon,
  Campaign as NoticeIcon,
  AccessTime as PrayerIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ChangeSubjectModal from '../../components/teacher/ChangeSubjectModal';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openSubjectModal, setOpenSubjectModal] = useState(false);

  // Get user from localStorage
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    {
      title: 'View Profile',
      description: 'View your personal information and details',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      color: 'primary',
      path: '/teacher/profile',
    },
    {
      title: 'Input Grades',
      description: 'Enter exam results and generate reports',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: 'success',
      path: '/teacher/marks-input',
    },
    {
      title: 'Report Attendance',
      description: 'Submit daily attendance records',
      icon: <AttendanceIcon sx={{ fontSize: 40 }} />,
      color: 'warning',
      path: '/teacher/attendance',
    },
    {
      title: 'Academic Calendar',
      description: 'View academic events and schedules',
      icon: <CalendarIcon sx={{ fontSize: 40 }} />,
      color: 'info',
      path: '/teacher/academic-calendar',
    },
    {
      title: 'Notices',
      description: 'View important announcements and updates',
      icon: <NoticeIcon sx={{ fontSize: 40 }} />,
      color: 'error',
      path: '/teacher/notices',
    },
    {
      title: 'Prayer Schedule',
      description: 'View daily prayer times',
      icon: <PrayerIcon sx={{ fontSize: 40 }} />,
      color: 'success',
      path: '/teacher/prayers',
    },
  ];

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
            mb={2}
          >
            <Box>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white" gutterBottom>
                Welcome back, {authUser?.name || 'Teacher'}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, color: 'white' }}>
                What would you like to do today?
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Logout
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  minHeight: 200,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                    borderColor: `${item.color}.main`,
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 2,
                      bgcolor: `${item.color}.lighter`,
                      color: `${item.color}.main`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    mb={2}
                    sx={{ flexGrow: 1 }}
                  >
                    {item.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color={item.color as any}
                    endIcon={<ArrowForwardIcon />}
                    size="small"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    Go
                  </Button>
                </CardContent>
              </Paper>
            </Grid>
          ))}

          {/* Change Subject Card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                minHeight: 200,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8],
                  borderColor: 'success.main',
                },
              }}
              onClick={() => setOpenSubjectModal(true)}
            >
              <CardContent
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 2,
                    bgcolor: 'success.lighter',
                    color: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <SubjectIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Change Subject
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  mb={2}
                  sx={{ flexGrow: 1 }}
                >
                  Update the subject you are teaching
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<ArrowForwardIcon />}
                  size="small"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  Go
                </Button>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>

        {/* Change Subject Modal */}
        <ChangeSubjectModal 
          open={openSubjectModal} 
          onClose={() => setOpenSubjectModal(false)} 
        />
      </Container>
    </Box>
  );
};

export default TeacherDashboard;
