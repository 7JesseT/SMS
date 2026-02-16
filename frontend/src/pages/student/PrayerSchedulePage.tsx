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
  Paper,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
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
            Loading prayer schedule...
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
            <MosqueIcon sx={{ color: 'white', fontSize: isMobile ? 28 : 32 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              Prayer Schedule
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">

        {/* Prayer Times Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {sortedPrayers.length === 0 ? (
              <Box p={8} textAlign="center">
                <MosqueIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No prayer times scheduled yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prayer schedule will appear here once set up
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {sortedPrayers.map((prayer, index) => (
                  <React.Fragment key={prayer._id}>
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
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        gap={3} 
                        width="100%"
                        flexDirection={isSmallScreen ? 'column' : 'row'}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'primary.lighter',
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <MosqueIcon sx={{ fontSize: 32 }} />
                        </Box>
                        
                        <Box flex={1} textAlign={isSmallScreen ? 'center' : 'left'}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {prayer.prayerName}
                          </Typography>
                          {prayer.description && (
                            <Typography variant="body2" color="text.secondary">
                              {prayer.description}
                            </Typography>
                          )}
                        </Box>

                        <Paper
                          elevation={0}
                          sx={{
                            px: 3,
                            py: 1.5,
                            bgcolor: 'success.lighter',
                            border: '1px solid',
                            borderColor: 'success.light',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <TimeIcon sx={{ color: 'success.main', fontSize: 24 }} />
                          <Typography variant="h5" fontWeight="bold" color="success.main">
                            {prayer.time}
                          </Typography>
                        </Paper>
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
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            bgcolor: 'info.lighter',
            border: '1px solid',
            borderColor: 'info.light',
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="start">
            <TimeIcon sx={{ color: 'info.main', mt: 0.2 }} />
            <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
              <strong style={{ color: theme.palette.info.dark }}>Note:</strong> These are the standard prayer times for the school. 
              Actual prayer times may vary based on your location and current season.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrayerSchedulePage;
