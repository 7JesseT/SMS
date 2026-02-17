import React, { useState } from 'react';
import {
  Box,
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
import { useTeacherNotices } from '../../services/teacherApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const TeacherNoticesPage: React.FC = () => {
  const { user, logout, getCurrentUserData } = useAuth() as any;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get teacherId from currentUser
  const currentUser = getCurrentUserData();
  const teacherId = user?.id || currentUser?._id;
  
  const { data: notices, isLoading, error } = useTeacherNotices(teacherId);
  
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
              onClick={() => navigate('/teacher/dashboard')}
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
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search notices by title or content..."
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
          </Box>
        </Paper>

        {/* Notices List */}
        <Grid container spacing={3}>
          {/* Notices List Column */}
          <Grid size={{ xs: 12, md: selectedNotice ? 5 : 12 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ p: 3, bgcolor: `${theme.palette.primary.main}`, color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">
                  All Notices ({sortedNotices.length})
                </Typography>
              </Box>
              <Divider />
              
              {sortedNotices.length > 0 ? (
                <List sx={{ p: 0, maxHeight: 600, overflow: 'auto' }}>
                  {sortedNotices.map((notice, index) => {
                    const isSelected = selectedNotice === notice._id;
                    const noticeDate = new Date(notice.date);
                    const isRecent = (new Date().getTime() - noticeDate.getTime()) / (1000 * 60 * 60 * 24) <= 7;

                    return (
                      <React.Fragment key={notice._id}>
                        <ListItem
                          sx={{
                            p: 2.5,
                            cursor: 'pointer',
                            bgcolor: isSelected ? 'action.selected' : 'transparent',
                            '&:hover': { bgcolor: 'action.hover' },
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                          onClick={() => setSelectedNotice(isSelected ? null : notice._id)}
                        >
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, width: '100%' }}>
                            {isRecent && (
                              <Chip
                                label="NEW"
                                color="error"
                                size="small"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                            <Chip
                              label={notice.target || 'All'}
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          </Stack>

                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {notice.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              mb: 1,
                            }}
                          >
                            {notice.details}
                          </Typography>

                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {format(noticeDate, 'MMM dd, yyyy')}
                            </Typography>
                          </Stack>
                        </ListItem>
                        {index < sortedNotices.length - 1 && <Divider />}
                      </React.Fragment>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <CampaignIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {searchQuery ? 'No matching notices' : 'No notices available'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery
                      ? 'Try adjusting your search terms'
                      : 'There are currently no notices to display'}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Notice Detail Column */}
          {selectedNotice && selectedNoticeData && (
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  position: isSmallScreen ? 'relative' : 'sticky',
                  top: isSmallScreen ? 'auto' : 20,
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Chip
                      label={selectedNoticeData.target || 'All'}
                      sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {selectedNoticeData.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {format(new Date(selectedNoticeData.date), 'EEEE, MMMM dd, yyyy')}
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                      color: 'text.primary',
                    }}
                  >
                    {selectedNoticeData.details}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeacherNoticesPage;
