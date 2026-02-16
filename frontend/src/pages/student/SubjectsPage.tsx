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
  Container,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import { mockSubjects } from '../../data/mockSubjects';
import { mockCurrentStudent } from '../../data/mockCurrentStudent';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SubjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');
  const student = mockCurrentStudent;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

  // Stat Card Component
  const StatCard = ({ icon, label, value, color = 'primary' }: any) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: `${color}.main`,
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1.5,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Box>
      <Typography 
        variant="h6" 
        fontWeight={700} 
        color={`${color}.main`}
        sx={{ ml: 0.5 }}
      >
        {value}
      </Typography>
    </Paper>
  );

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

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
          >
            <BookIcon sx={{ color: 'white', fontSize: isMobile ? 28 : 32 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              My Subjects
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Overview Cards */}
        <Grid container spacing={2.5} mb={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              icon={<SchoolIcon sx={{ fontSize: 28 }} />}
              label="Total Subjects"
              value={mySubjects.length}
              color="primary"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              icon={<ScheduleIcon sx={{ fontSize: 28 }} />}
              label="Weekly Sessions"
              value={totalSessions}
              color="info"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              icon={<PersonIcon sx={{ fontSize: 28 }} />}
              label="My Class"
              value={student.sclassName.sclassName}
              color="success"
            />
          </Grid>
        </Grid>

        {/* Search Bar */}
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
              placeholder="Search subjects by name, code, teacher, or description..."
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

        {/* Subjects Grid */}
        <Grid container spacing={3}>
          {filteredSubjects.map((subject) => (
            <Grid size={{ xs: 12, md: 6 }} key={subject._id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {subject.subName}
                    </Typography>
                    <Chip 
                      label={subject.subCode} 
                      size="small" 
                      sx={{
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.lighter', 
                      color: 'primary.main',
                      width: 48,
                      height: 48,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {subject.subName.charAt(0)}
                  </Avatar>
                </Box>

                <Divider sx={{ my: 2 }} />

                <List disablePadding>
                  <ListItem disablePadding sx={{ mb: 1.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          Teacher
                        </Typography>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'success.main' }}>
                            <PersonIcon sx={{ fontSize: 14 }} />
                          </Avatar>
                          <Typography variant="body1" fontWeight={600}>
                            {subject.teacher?.name || 'Not assigned'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>

                  <ListItem disablePadding sx={{ mb: 1.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          Sessions per Week
                        </Typography>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                          <ScheduleIcon sx={{ fontSize: 20, color: 'info.main' }} />
                          <Typography variant="body1" fontWeight={600}>
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
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Description
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" mt={0.5} color="text.primary">
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
      </Container>
    </Box>
  );
};

export default SubjectsPage;
