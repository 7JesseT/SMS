import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Divider,
  Paper,
  List,
  ListItem,
  Button,
  CircularProgress,
  Alert,
  Container,
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
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

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
          <CampaignIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Notices & Announcements
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load notices
          </Alert>
        )}

        {/* Header Stats */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <NotificationIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {noticesArray.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Notices
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <CalendarIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {thisWeekNotices}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This Week
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <Card sx={{ mb: 3 }}>
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
            />
          </CardContent>
        </Card>

        {/* Notices List */}
        <Grid container spacing={3}>
          {/* Notice List */}
          <Grid item xs={12} md={selectedNoticeData ? 5 : 12}>
            <Card>
              <CardContent sx={{ p: 0 }}>
                {sortedNotices.length === 0 ? (
                  <Box p={4} textAlign="center">
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
                                color="primary"
                                sx={{ ml: 1 }}
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
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedNoticeData.title}
                    </Typography>
                    <Chip
                      label={selectedNoticeData.target || 'All'}
                      color="primary"
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
