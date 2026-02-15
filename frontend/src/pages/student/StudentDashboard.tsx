import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Container,
} from '@mui/material';
import {
  ReportProblem as ComplaintIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  Logout as LogoutIcon,
  Campaign as NoticesIcon,
  CalendarMonth as CalendarIcon,
  Mosque as PrayerIcon,
  Assessment as GradesIcon,
} from '@mui/icons-material';
import ComplaintModal from '../../components/student/ComplaintModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStudentNotices, useAcademicCalendar, usePrayerSchedule } from '../../services/studentApi';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Logout Button */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        {/* Welcome Section */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user?.name || 'Student'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            What would you like to do today?
          </Typography>
        </Box>

        {/* Main Action Cards */}
        <Box display="flex" gap={3} flexWrap="wrap">
        {/* Create Complaint Card */}
        <Box flex="1" minWidth="300px">
          <Card
            elevation={3}
            sx={{
              height: '100%',
              minHeight: 280,
              transition: 'all 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
            onClick={() => setOpenComplaintModal(true)}
          >
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'error.main',
                  mb: 3,
                }}
              >
                <ComplaintIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Create Complaint
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Submit a formal complaint or report an issue
              </Typography>
              <Button
                variant="contained"
                color="error"
                endIcon={<ArrowForwardIcon />}
                size="large"
              >
                Submit Complaint
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Student Profile Card */}
        <Box flex="1" minWidth="300px">
          <Card
            elevation={3}
            sx={{
              height: '100%',
              minHeight: 280,
              transition: 'all 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
            onClick={() => navigate('/student/profile')}
          >
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  mb: 3,
                }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                My Profile
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                View and edit your personal information
              </Typography>
                <Button
                variant="contained"
                color="success"
                endIcon={<ArrowForwardIcon />}
                size="large"
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Notices Card */}
        <Box flex="1" minWidth="300px">
          <Card
            elevation={3}
            sx={{
              height: '100%',
              minHeight: 280,
              transition: 'all 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
            onClick={() => navigate('/student/notices')}
          >
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'info.main',
                  mb: 3,
                }}
              >
                <NoticesIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Notices
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                View daily announcements and notices
              </Typography>
              <Button
                variant="contained"
                color="info"
                endIcon={<ArrowForwardIcon />}
                size="large"
              >
                View Notices
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Exam Results Card */}
        <Box flex="1" minWidth="300px">
          <Card
            elevation={3}
            sx={{
              height: '100%',
              minHeight: 280,
              transition: 'all 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
            onClick={() => navigate('/student/exam-results')}
          >
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'success.main',
                  mb: 3,
                }}
              >
                <GradesIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Exam Results
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                View your academic performance
              </Typography>
              <Button
                variant="contained"
                color="success"
                endIcon={<ArrowForwardIcon />}
                size="large"
              >
                View Results
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Academic Calendar Card */}
        <Box flex="1" minWidth="300px">
          <Card
            elevation={3}
            sx={{
              height: '100%',
              minHeight: 280,
              transition: 'all 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
            onClick={() => navigate('/student/calendar')}
          >
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'warning.main',
                  mb: 3,
                }}
              >
                <CalendarIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Academic Calendar
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                View school events and important dates
              </Typography>
                     <Button
                variant="contained"
                color="success"
                endIcon={<ArrowForwardIcon />}
                size="large"
              >
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Prayer Schedule Card */}
        <Box flex="1" minWidth="300px">
          <Card
            elevation={3}
            sx={{
              height: '100%',
              minHeight: 280,
              transition: 'all 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
            onClick={() => navigate('/student/prayers')}
          >
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'secondary.main',
                  mb: 3,
                }}
              >
                <PrayerIcon sx={{ fontSize: 60, color: 'gold' }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Prayer Schedule
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                View daily prayer times
              </Typography>
                     <Button
                variant="contained"
                color="success"
                endIcon={<ArrowForwardIcon />}
                size="large"
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

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
