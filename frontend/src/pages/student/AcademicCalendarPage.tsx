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
  ListItemText,
  Divider,
} from '@mui/material';
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
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error">
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/student/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <CalendarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Academic Calendar
          </Typography>
        </Box>

        {/* Stats Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" gap={4} flexWrap="wrap">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Events
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {events?.length || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Exams
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {events?.filter(e => e.eventType === 'Exam').length || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Holidays
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {events?.filter(e => e.eventType === 'Holiday').length || 0}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {sortedEvents.length === 0 ? (
              <Box p={4} textAlign="center">
                <Typography variant="h6" color="text.secondary">
                  No events scheduled yet
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {sortedEvents.map((event, index) => (
                  <React.Fragment key={event._id}>
                    <ListItem sx={{ py: 3, px: 3 }}>
                      <Box flex={1}>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <EventIcon color="action" />
                            <Typography variant="h6" fontWeight="bold">
                              {event.title}
                            </Typography>
                          </Box>
                          <Chip
                            label={event.eventType}
                            color={getEventTypeColor(event.eventType)}
                            size="small"
                          />
                        </Box>

                        <Typography variant="body1" color="text.secondary" mb={2}>
                          {event.description}
                        </Typography>

                        <Box display="flex" gap={3} flexWrap="wrap">
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Start Date
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {format(new Date(event.startDate), 'MMMM dd, yyyy')}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              End Date
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {format(new Date(event.endDate), 'MMMM dd, yyyy')}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Duration
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
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
