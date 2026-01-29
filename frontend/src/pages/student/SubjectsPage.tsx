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
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { mockSubjects } from '../../data/mockSubjects';
import { mockCurrentStudent } from '../../data/mockCurrentStudent';

const SubjectsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const student = mockCurrentStudent;

  // Get subjects for student's class
  const mySubjects = mockSubjects.filter(
    subject => subject.sclassName._id === student.sclassName._id
  );

  // Filter by search query
  const filteredSubjects = mySubjects.filter(
    subject =>
      subject.subName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.subCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSessions = mySubjects.reduce((sum, subject) => sum + subject.sessions, 0);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Subjects
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SchoolIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {mySubjects.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Subjects
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
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalSessions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Weekly Sessions
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
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {student.sclassName.sclassName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    My Class
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
        placeholder="Search subjects by name, code, teacher, or description..."
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

      {/* Subjects Grid */}
      <Grid container spacing={3}>
        {filteredSubjects.map((subject) => (
          <Grid size={{ xs: 12, md: 6 }} key={subject._id}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {subject.subName}
                  </Typography>
                  <Chip label={subject.subCode} size="small" color="primary" />
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                  {subject.subName.charAt(0)}
                </Avatar>
              </Box>

              <Divider sx={{ my: 2 }} />

              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary">
                        Teacher
                      </Typography>
                    }
                    secondary={
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'success.main' }}>
                          <PersonIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography variant="body1" fontWeight="medium">
                          {subject.teacher?.name || 'Not assigned'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>

                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary">
                        Sessions per Week
                      </Typography>
                    }
                    secondary={
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <ScheduleIcon sx={{ fontSize: 20, color: 'info.main' }} />
                        <Typography variant="body1" fontWeight="medium">
                          {subject.sessions} sessions
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>

                {subject.description && (
                  <ListItem disablePadding>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary">
                          Description
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" mt={0.5}>
                          {subject.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        ))}

        {filteredSubjects.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Box textAlign="center" py={8}>
              <SchoolIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No subjects found
              </Typography>
              <Typography color="text.secondary">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'No subjects assigned to your class yet'}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SubjectsPage;
