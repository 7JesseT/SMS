import React from 'react';
import {
  Box,
  Typography,
  CardContent,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
  Paper,
} from '@mui/material';
import Grid from "@mui/material/Grid";
import {
  Class as ClassIcon,
  Subject as SubjectIcon,
  Campaign as NoticeIcon,
  Report as ComplaintIcon,
  ArrowForward as ArrowForwardIcon,
  Logout as LogoutIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as PrayerIcon,
  Assessment as MarksIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Get full user data for display
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleLogout = async () => {
    await logout();
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
                Welcome back, {user?.name || currentUser?.name || currentUser?.schoolName || 'Admin'}!
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Manage your school with ease
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
              icon={<ClassIcon sx={{ fontSize: 40 }} />}
              title="Manage Classes"
              description="Create, view, and delete classes"
              buttonText="Manage"
              onClick={() => navigate('/admin/classes')}
              color="info"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<SubjectIcon sx={{ fontSize: 40 }} />}
              title="Manage Subjects"
              description="Create, view, and delete subjects"
              buttonText="Manage"
              onClick={() => navigate('/admin/subjects')}
              color="warning"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<NoticeIcon sx={{ fontSize: 40 }} />}
              title="Manage Notices"
              description="Create, update, and delete notices"
              buttonText="Manage"
              onClick={() => navigate('/admin/notices')}
              color="error"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<ComplaintIcon sx={{ fontSize: 40 }} />}
              title="View Complaints"
              description="Review all student complaints"
              buttonText="View"
              onClick={() => navigate('/admin/complaints')}
              color="info"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<CalendarIcon sx={{ fontSize: 40 }} />}
              title="Academic Calendar"
              description="Manage school events & exams"
              buttonText="Manage"
              onClick={() => navigate('/admin/calendar')}
              color="primary"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<PrayerIcon sx={{ fontSize: 40 }} />}
              title="Prayer Schedule"
              description="Manage prayer times"
              buttonText="Manage"
              onClick={() => navigate('/admin/prayer-schedule')}
              color="success"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <QuickActionCard
              icon={<MarksIcon sx={{ fontSize: 40 }} />}
              title="Student Marks"
              description="View, edit & generate reports"
              buttonText="Manage"
              onClick={() => navigate('/admin/marks')}
              color="warning"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
