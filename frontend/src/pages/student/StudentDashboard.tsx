import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ReportProblem as ComplaintIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  Logout as LogoutIcon,
  Campaign as NoticesIcon,
  CalendarMonth as CalendarIcon,
  Mosque as PrayerIcon,
  Assessment as GradesIcon,
  School as SchoolIcon,
  Book as SubjectsIcon,
  EventNote as AttendanceIcon,
} from '@mui/icons-material';
import ComplaintModal from '../../components/student/ComplaintModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStudentNotices, useAcademicCalendar, usePrayerSchedule } from '../../services/studentApi';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openComplaintModal, setOpenComplaintModal] = useState(false);

  // Get schoolId from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const schoolId = typeof currentUser.school === 'string' 
    ? currentUser.school 
    : currentUser.school?._id;

  // Fetch data for dashboard stats
  useStudentNotices(user?.id);
  useAcademicCalendar(schoolId);
  usePrayerSchedule(schoolId);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Quick Action Card Component
  const QuickActionCard = ({ 
    icon, 
    title, 
    description, 
    buttonText, 
    onClick, 
    color = 'primary' 
  }: any) => (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          borderColor: `${color}.main`,
          boxShadow: theme.shadows[8],
          transform: 'translateY(-4px)',
        },
      }}
      onClick={onClick}
    >
      <CardContent
        sx={{
          height: '100%',
          minHeight: 260,
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
            p: 2.5,
            borderRadius: 3,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2.5,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {description}
        </Typography>
        <Button
          variant="contained"
          color={color}
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: 3,
            py: 1,
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            '&:hover': {
              boxShadow: theme.shadows[8],
              transform: 'translateY(-2px)',
            },
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Paper>
  );

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
          >
            <Box>
              <Typography 
                variant={isMobile ? 'h5' : 'h4'} 
                fontWeight="bold" 
                color="white"
                gutterBottom
              >
                Welcome back, {user?.name || 'Student'}!
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                What would you like to do today?
              </Typography>
            </Box>
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
        </Container>
      </Box>

      <Container maxWidth="lg">

        {/* Quick Actions Grid */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<PersonIcon sx={{ fontSize: 40 }} />}
              title="My Profile"
              description="View and edit your personal information"
              buttonText="View Profile"
              onClick={() => navigate('/student/profile')}
              color="primary"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<GradesIcon sx={{ fontSize: 40 }} />}
              title="Exam Results"
              description="View your academic performance and grades"
              buttonText="View Results"
              onClick={() => navigate('/student/exam-results')}
              color="success"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<SubjectsIcon sx={{ fontSize: 40 }} />}
              title="My Subjects"
              description="View your enrolled subjects and details"
              buttonText="View Subjects"
              onClick={() => navigate('/student/subjects')}
              color="info"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<AttendanceIcon sx={{ fontSize: 40 }} />}
              title="Attendance"
              description="Track your class attendance records"
              buttonText="View Attendance"
              onClick={() => navigate('/student/attendance')}
              color="warning"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<NoticesIcon sx={{ fontSize: 40 }} />}
              title="Notices"
              description="View daily announcements and notices"
              buttonText="View Notices"
              onClick={() => navigate('/student/notices')}
              color="info"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<ComplaintIcon sx={{ fontSize: 40 }} />}
              title="Complaints"
              description="Submit and track your complaints"
              buttonText="View Complaints"
              onClick={() => navigate('/student/complaints')}
              color="error"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<CalendarIcon sx={{ fontSize: 40 }} />}
              title="Academic Calendar"
              description="View school events and important dates"
              buttonText="View Calendar"
              onClick={() => navigate('/student/calendar')}
              color="warning"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<PrayerIcon sx={{ fontSize: 40 }} />}
              title="Prayer Schedule"
              description="View daily prayer times"
              buttonText="View Schedule"
              onClick={() => navigate('/student/prayers')}
              color="success"
            />
          </Grid>
        </Grid>

      {/* Complaint Modal */}
      <ComplaintModal 
        open={openComplaintModal} 
        onClose={() => setOpenComplaintModal(false)} 
      />
      </Container>
    </Box>
  );
};

export default StudentDashboard;
