import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Event } from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { calendarApi } from '../../services/api';
import type { AcademicCalendar } from '../../types/entities.types';

const eventTypeColors: Record<string, 'primary' | 'success' | 'error' | 'warning' | 'info'> = {
  Exam: 'error',
  Holiday: 'success',
  Event: 'primary',
  Term: 'warning',
  Other: 'info',
};

export const TeacherCalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<AcademicCalendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCalendarEvents();
  }, [user]);

  const fetchCalendarEvents = async () => {
    if (!user?.school) return;

    try {
      setLoading(true);
      const response = await calendarApi.getAll(user.school);
      setEvents(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load calendar');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Academic Calendar
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {events.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No events scheduled</Typography>
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
    </Box>
  );
};
