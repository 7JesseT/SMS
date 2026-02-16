import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  Button,
  CircularProgress,
  Alert,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Search as SearchIcon,
  Notifications as NotificationIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import { useStudentNotices } from '../../services/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const NoticesPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: notices, isLoading, error } = useStudentNotices(user?.id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Ensure notices is an array
  const noticesArray = Array.isArray(notices) ? notices : [];

  // Filter by search query
  const filteredNotices = noticesArray.filter(
    notice =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by date (most recent first)
  const sortedNotices = [...filteredNotices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const selectedNoticeData = sortedNotices.find(n => n._id === selectedNotice);

  // Calculate stats
  const thisWeekNotices = noticesArray.filter(n => {
    const noticeDate = new Date(n.date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - noticeDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

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
            Loading notices...
          </Typography>
        </Stack>
      </Box>
    );
  }

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
            <CampaignIcon sx={{ color: 'white', fontSize: isMobile ? 28 : 32 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              Notices & Announcements
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            Failed to load notices
          </Alert>
        )}

        {/* Header Stats */}
        <Grid container spacing={3} mb={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                  }}
                >
                  <NotificationIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {noticesArray.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Total Notices
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'success.main',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'success.lighter',
                    color: 'success.main',
                  }}
                >
                  <CalendarIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {thisWeekNotices}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    This Week
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Search */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Notices List */}
        <Grid container spacing={3}>
          {/* Notice List */}
          <Grid size={{ xs: 12, md: selectedNoticeData ? 5 : 12 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {sortedNotices.length === 0 ? (
                  <Box p={4} textAlign="center">
                    <CampaignIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      {searchQuery ? 'No notices found' : 'No notices available'}
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {sortedNotices.map((notice, index) => (
                      <React.Fragment key={notice._id}>
                        <ListItem
                          sx={{
                            cursor: 'pointer',
                            bgcolor: selectedNotice === notice._id ? 'action.selected' : 'transparent',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                            p: 2,
                          }}
                          onClick={() => setSelectedNotice(notice._id)}
                        >
                          <Box flex={1}>
                            <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {notice.title}
                              </Typography>
                              <Chip
                                label={notice.target || 'All'}
                                size="small"
                                sx={{
                                  ml: 1,
                                  bgcolor: 'primary.lighter',
                                  color: 'primary.main',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {notice.details}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2} mt={1}>
                              <Typography variant="caption" color="text.secondary">
                                {format(new Date(notice.date), 'MMM dd, yyyy')}
                              </Typography>
                            </Box>
                          </Box>
                        </ListItem>
                        {index < sortedNotices.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Notice Details */}
          {selectedNoticeData && (
            <Grid size={{ xs: 12, md: 7 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedNoticeData.title}
                    </Typography>
                    <Chip
                      label={selectedNoticeData.target || 'All'}
                      sx={{
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(selectedNoticeData.date), 'MMMM dd, yyyy')}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {selectedNoticeData.details}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default NoticesPage;
