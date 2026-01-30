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
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  Logout as LogoutIcon,
  Subject as SubjectIcon,
  AssignmentTurnedIn as AttendanceIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ChangeSubjectModal from '../../components/teacher/ChangeSubjectModal';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openSubjectModal, setOpenSubjectModal] = useState(false);

  // Get user from localStorage
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');

  const handleLogout = async () => {
    await logout();
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
            Welcome back, {authUser?.name || 'Teacher'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            What would you like to do today?
          </Typography>
        </Box>

        {/* Main Action Cards */}
        <Box display="flex" gap={3} flexWrap="wrap">
          {/* View Profile Card */}
          <Box flex="1" minWidth="280px">
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
              onClick={() => navigate('/teacher/profile')}
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
                  View Profile
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  View your personal information and details
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  size="large"
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Change Subject Card */}
          <Box flex="1" minWidth="280px">
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
              onClick={() => setOpenSubjectModal(true)}
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
                  <SubjectIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Change Subject
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  Update the subject you are teaching
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<ArrowForwardIcon />}
                  size="large"
                >
                  Change Subject
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Report Attendance Card */}
          <Box flex="1" minWidth="280px">
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
              onClick={() => navigate('/teacher/attendance')}
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
                  <AttendanceIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Report Attendance
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  Submit daily attendance records
                </Typography>
                <Button
                  variant="contained"
                  color="warning"
                  endIcon={<ArrowForwardIcon />}
                  size="large"
                >
                  Report Attendance
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>

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
