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
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Search as SearchIcon,
  Notifications as NotificationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { mockNotices } from '../../data/mockNotices';

const NoticesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);

  // Filter notices for students (target: Student or All)
  const studentNotices = mockNotices.filter(
    notice => notice.target === 'Student' || notice.target === 'All'
  );

  // Filter by search query
  const filteredNotices = studentNotices.filter(
    notice =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by date (most recent first)
  const sortedNotices = [...filteredNotices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const selectedNoticeData = sortedNotices.find(n => n._id === selectedNotice);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Notices & Announcements
      </Typography>

      {/* Header Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <NotificationIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {studentNotices.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Notices
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CalendarIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {studentNotices.filter(n => {
                      const noticeDate = new Date(n.date);
                      const now = new Date();
                      const diffDays = Math.floor((now.getTime() - noticeDate.getTime()) / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    }).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This Week
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {studentNotices.filter(n => n.target === 'Student').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Student Specific
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search notices by title, content, or author..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Notices Grid */}
      <Grid container spacing={3}>
        {/* Notices List */}
        <Grid size={{ xs: 12, md: selectedNotice ? 6 : 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              All Notices ({sortedNotices.length})
            </Typography>
            <List sx={{ maxHeight: 600, overflow: 'auto' }}>
              {sortedNotices.map((notice, index) => (
                <React.Fragment key={notice._id}>
                  <ListItem
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' },
                      bgcolor: selectedNotice === notice._id ? 'action.selected' : 'transparent',
                    }}
                    onClick={() => setSelectedNotice(notice._id)}
                  >
                    <Box width="100%">
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                        <Typography variant="body1" fontWeight="bold">
                          {notice.title}
                        </Typography>
                        <Chip
                          label={notice.target}
                          size="small"
                          color={notice.target === 'Student' ? 'primary' : 'default'}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {notice.details}
                      </Typography>
                      <Box display="flex" gap={2} mt={1}>
                        <Typography variant="caption" color="text.secondary">
                          <CalendarIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          {new Date(notice.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <PersonIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          {notice.author}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < sortedNotices.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {sortedNotices.length === 0 && (
                <Box textAlign="center" py={4}>
                  <NotificationIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    No notices found matching your search
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Notice Detail View */}
        {selectedNotice && selectedNoticeData && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                <Typography variant="h5" fontWeight="bold">
                  Notice Details
                </Typography>
                <Button size="small" onClick={() => setSelectedNotice(null)}>
                  Close
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {selectedNoticeData.title}
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={selectedNoticeData.target}
                    size="small"
                    color={selectedNoticeData.target === 'Student' ? 'primary' : 'default'}
                  />
                  <Chip
                    label={new Date(selectedNoticeData.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box mb={3}>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedNoticeData.details}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Posted by
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {selectedNoticeData.author.charAt(0)}
                  </Avatar>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedNoticeData.author}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Published on {new Date(selectedNoticeData.createdAt!).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default NoticesPage;
