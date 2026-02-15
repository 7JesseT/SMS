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
  List,
  ListItem,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  AccessTime as TimeIcon,
  Mosque as MosqueIcon,
} from '@mui/icons-material';
import { usePrayerSchedule } from '../../services/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PrayerSchedulePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Get schoolId from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const schoolId = typeof currentUser.school === 'string' 
    ? currentUser.school 
    : currentUser.school?._id;

  const { data: prayers, isLoading, error } = usePrayerSchedule(schoolId);

  const handleLogout = () => {
    logout();
    navigate('/');
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
            {error instanceof Error ? error.message : 'Failed to load prayer schedule'}
          </Alert>
        </Container>
      </Box>
    );
  }

  // Define prayer order for sorting
  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  const sortedPrayers = [...(prayers || [])].sort((a, b) => {
    const orderA = prayerOrder.indexOf(a.prayerName);
    const orderB = prayerOrder.indexOf(b.prayerName);
    if (orderA !== -1 && orderB !== -1) return orderA - orderB;
    if (orderA !== -1) return -1;
    if (orderB !== -1) return 1;
    return a.prayerName.localeCompare(b.prayerName);
  });

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
          <MosqueIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Prayer Schedule
          </Typography>
        </Box>

        {/* Prayer Times Card */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {sortedPrayers.length === 0 ? (
              <Box p={4} textAlign="center">
                <Typography variant="h6" color="text.secondary">
                  No prayer times scheduled yet
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {sortedPrayers.map((prayer, index) => (
                  <React.Fragment key={prayer._id}>
                    <ListItem sx={{ py: 3, px: 3 }}>
                      <Box display="flex" alignItems="center" gap={3} width="100%">
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 56,
                            height: 56,
                          }}
                        >
                          <MosqueIcon />
                        </Avatar>
                        
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {prayer.prayerName}
                          </Typography>
                          {prayer.description && (
                            <Typography variant="body2" color="text.secondary">
                              {prayer.description}
                            </Typography>
                          )}
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                          <TimeIcon color="action" />
                          <Typography variant="h5" fontWeight="bold" color="primary.main">
                            {prayer.time}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < sortedPrayers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card sx={{ mt: 3, bgcolor: 'info.lighter' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> These are the standard prayer times for the school. 
              Actual prayer times may vary based on your location and current season.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PrayerSchedulePage;
