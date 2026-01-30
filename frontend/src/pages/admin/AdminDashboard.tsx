import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Container,
} from '@mui/material';
import Grid from "@mui/material/Grid";
import {
  Class as ClassIcon,
  Subject as SubjectIcon,
  Campaign as NoticeIcon,
  Report as ComplaintIcon,
  ArrowForward as ArrowForwardIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Get full user data for display
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

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
        <Box mb={5}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user?.name || currentUser?.name || currentUser?.schoolName || 'Admin'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your school with ease
          </Typography>
        </Box>

        {/* Management Grid - 2x2 Layout */}
        <Box display="flex" justifyContent="center">
          <Grid container spacing={3} maxWidth="1200px">
            {/* Classes Management */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                minHeight: 220,
                transition: 'all 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate('/admin/classes')}
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
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    mb: 2,
                  }}
                >
                  <ClassIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Manage Classes
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Create, view, and delete classes
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  size="small"
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Subjects Management */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                minHeight: 220,
                transition: 'all 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate('/admin/subjects')}
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
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'success.main',
                    mb: 2,
                  }}
                >
                  <SubjectIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Manage Subjects
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Create, view, and delete subjects
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<ArrowForwardIcon />}
                  size="small"
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Notices Management */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                minHeight: 220,
                transition: 'all 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate('/admin/notices')}
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
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'warning.main',
                    mb: 2,
                  }}
                >
                  <NoticeIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Manage Notices
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Create, update, and delete notices
                </Typography>
                <Button
                  variant="contained"
                  color="warning"
                  endIcon={<ArrowForwardIcon />}
                  size="small"
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Complaints */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                minHeight: 220,
                transition: 'all 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate('/admin/complaints')}
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
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'error.main',
                    mb: 2,
                  }}
                >
                  <ComplaintIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  View Complaints
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Review all student complaints
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ArrowForwardIcon />}
                  size="small"
                >
                  View
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
