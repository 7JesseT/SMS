import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Container,
  Button,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Event,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTeacherAcademicCalendar } from '../../services/teacherApi';

const eventTypeColors: Record<string, 'primary' | 'success' | 'error' | 'warning' | 'info'> = {
  Exam: 'error',
  Holiday: 'success',
  Event: 'primary',
  Term: 'warning',
  Other: 'info',
};

export const TeacherCalendarPage: React.FC = () => {
  const { logout, getCurrentUserData } = useAuth() as any;
  const navigate = useNavigate();
  
  // Get schoolId from currentUser in localStorage
  const currentUser = getCurrentUserData();
  const schoolId = typeof currentUser?.school === 'string' 
    ? currentUser.school 
    : currentUser?.school?._id;
  
  console.log('TeacherCalendarPage - currentUser:', currentUser);
  console.log('TeacherCalendarPage - schoolId:', schoolId);
  
  const { data: events = [], isLoading, error } = useTeacherAcademicCalendar(schoolId);
  
  console.log('TeacherCalendarPage - events:', events);
  console.log('TeacherCalendarPage - isLoading:', isLoading);
  console.log('TeacherCalendarPage - error:', error);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate statistics
  const today = new Date();
  const upcomingEvents = events.filter(event => new Date(event.startDate) > today).length;
  const totalExams = events.filter(event => event.eventType === 'Exam').length;

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
            Loading academic calendar...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pt: 3,
          pb: 8,
          px: 3,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'inherit',
            clipPath: 'polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/teacher/dashboard')}
              sx={{ color: 'white' }}
            >
              Back to Dashboard
            </Button>
            <Button
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ color: 'white' }}
            >
              Logout
            </Button>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <CalendarIcon sx={{ fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Academic Calendar
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Stay updated with important academic events and schedules
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 1 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                {events.length}
              </Typography>
              <Typography variant="body2">Total Events</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                {upcomingEvents}
              </Typography>
              <Typography variant="body2">Upcoming Events</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                {totalExams}
              </Typography>
              <Typography variant="body2">Total Exams</Typography>
            </Paper>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error instanceof Error ? error.message : 'Failed to load academic calendar. Please try again.'}
          </Alert>
        )}

        {events.length === 0 ? (
          <Paper 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <Event sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Events Scheduled
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are currently no events in the academic calendar
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {events.map((event) => (
              <Grid size={{ xs: 12, md: 6 }} key={event._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Typography variant="h6">{event.title}</Typography>
                      <Chip
                        label={event.eventType}
                        color={eventTypeColors[event.eventType] || 'default'}
                        size="small"
                      />
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Event fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(event.startDate), 'MMM dd, yyyy')} -{' '}
                        {format(new Date(event.endDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{event.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};
