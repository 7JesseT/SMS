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
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Notice } from '../../types/entities.types';

export const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, [user]);

  const fetchAnnouncements = async () => {
    if (!user?.school) return;

    try {
      setLoading(true);
      const response = await api.get(`/NoticeList/${user.school}`);
      // Filter announcements for students
      const studentAnnouncements = response.data.filter(
        (notice: Notice) => notice.target === 'All' || notice.target === 'Student'
      );
      setAnnouncements(studentAnnouncements);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load announcements');
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
        Announcements
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {announcements.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No announcements available</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {announcements.map((announcement) => (
            <Card key={announcement._id}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                  <Typography variant="h6">{announcement.title}</Typography>
                  <Chip
                    label={announcement.target || 'All'}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {format(new Date(announcement.date), 'MMM dd, yyyy')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {announcement.details}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
