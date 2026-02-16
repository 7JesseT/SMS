import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Button,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  CalendarMonth as CalendarIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useAcademicCalendar } from '../../services/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const AcademicCalendarPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get schoolId from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const schoolId = typeof currentUser.school === 'string' 
    ? currentUser.school 
    : currentUser.school?._id;

  const { data: events, isLoading, error } = useAcademicCalendar(schoolId);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getEventTypeColor = (type: string): 'error' | 'warning' | 'info' | 'success' | 'default' => {
    switch (type) {
      case 'Exam':
        return 'error';
      case 'Holiday':
        return 'success';
      case 'Event':
        return 'info';
      case 'Term':
        return 'warning';
      default:
        return 'default';
    }
  };

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
            Loading calendar...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error instanceof Error ? error.message : 'Failed to load academic calendar'}
          </Alert>
        </Container>
      </Box>
    );
  }

  // Sort events by start date
  const sortedEvents = [...(events || [])].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Stat Card Component
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
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
        </Box>
      </Box>
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

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <CalendarIcon sx={{ color: 'white', fontSize: isMobile ? 28 : 32 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              Academic Calendar
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">

        {/* Stats Card */}
        <Grid container spacing={2.5} mb={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<CalendarIcon sx={{ fontSize: 28 }} />}
              label="Total Events"
              value={events?.length || 0}
              color="primary"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<EventIcon sx={{ fontSize: 28 }} />}
              label="Exams"
              value={events?.filter(e => e.eventType === 'Exam').length || 0}
              color="error"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<EventIcon sx={{ fontSize: 28 }} />}
              label="Holidays"
              value={events?.filter(e => e.eventType === 'Holiday').length || 0}
              color="success"
            />
          </Grid>
        </Grid>

        {/* Events List */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {sortedEvents.length === 0 ? (
              <Box p={8} textAlign="center">
                <CalendarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No events scheduled yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Academic calendar events will appear here
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {sortedEvents.map((event, index) => (
                  <React.Fragment key={event._id}>
                    <ListItem 
                      sx={{ 
                        py: 3, 
                        px: 3,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <Box flex={1}>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1.5}>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 1.5,
                                bgcolor: `${getEventTypeColor(event.eventType)}.lighter`,
                                color: `${getEventTypeColor(event.eventType)}.main`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <EventIcon sx={{ fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" fontWeight="bold">
                              {event.title}
                            </Typography>
                          </Box>
                          <Chip
                            label={event.eventType}
                            color={getEventTypeColor(event.eventType)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Typography variant="body1" color="text.secondary" mb={2.5} sx={{ ml: 0.5 }}>
                          {event.description}
                        </Typography>

                        <Box display="flex" gap={3} flexWrap="wrap" sx={{ ml: 0.5 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" fontWeight={500}>
                              Start Date
                            </Typography>
                            <Typography variant="body2" fontWeight={600} mt={0.5}>
                              {format(new Date(event.startDate), 'MMMM dd, yyyy')}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" fontWeight={500}>
                              End Date
                            </Typography>
                            <Typography variant="body2" fontWeight={600} mt={0.5}>
                              {format(new Date(event.endDate), 'MMMM dd, yyyy')}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" fontWeight={500}>
                              Duration
                            </Typography>
                            <Typography variant="body2" fontWeight={600} mt={0.5}>
                              {Math.ceil(
                                (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / 
                                (1000 * 60 * 60 * 24)
                              ) + 1} days
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < sortedEvents.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AcademicCalendarPage;
