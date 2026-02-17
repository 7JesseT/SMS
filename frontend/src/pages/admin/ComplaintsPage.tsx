import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Alert, CircularProgress,
  Container, Paper, useTheme, useMediaQuery, Stack, List, ListItem, Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  ReportProblem as ComplaintIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import type { ComplaintData } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';

const ComplaintsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const [complaints, setComplaints] = useState<ComplaintData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    if (!authUser?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await adminApi.getComplaintList(authUser.id);
      setComplaints(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Loading complaints...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header with Gradient */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 6,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/dashboard')}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Dashboard
            </Button>
            <Button
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Logout
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <ComplaintIcon sx={{ fontSize: 40 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              Student Complaints
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  display: 'inline-flex',
                  mb: 2,
                }}
              >
                <ComplaintIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {complaints.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Complaints
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'success.lighter',
                  color: 'success.main',
                  display: 'inline-flex',
                  mb: 2,
                }}
              >
                <PersonIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {new Set(complaints.map(c => c.user?._id).filter(Boolean)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Students
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'info.lighter',
                  color: 'info.main',
                  display: 'inline-flex',
                  mb: 2,
                }}
              >
                <CalendarIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {complaints.filter(c => {
                  const today = new Date();
                  const complaintDate = new Date(c.date);
                  const diffTime = Math.abs(today.getTime() - complaintDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 7;
                }).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Week
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Complaints List Card */}
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
            {complaints.length === 0 ? (
              <Box p={8} textAlign="center">
                <ComplaintIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No complaints found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All caught up! No student complaints to review.
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {complaints.map((complaint, index) => (
                  <React.Fragment key={complaint._id}>
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
                            bgcolor: 'error.lighter',
                            color: 'error.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ComplaintIcon sx={{ fontSize: 32 }} />
                        </Box>

                        <Box flex={1} textAlign={isSmallScreen ? 'center' : 'left'}>
                          <Stack direction="row" spacing={1} alignItems="center" mb={1} justifyContent={isSmallScreen ? 'center' : 'flex-start'}>
                            <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                              {complaint.user ? complaint.user.name : 'Anonymous'}
                            </Typography>
                          </Stack>
                          <Typography variant="body1" color="text.primary" mb={1}>
                            {complaint.complaint}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent={isSmallScreen ? 'center' : 'flex-start'}>
                            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(complaint.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < complaints.length - 1 && <Divider />}
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
            <ComplaintIcon sx={{ color: 'info.main', mt: 0.2 }} />
            <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
              <strong style={{ color: theme.palette.info.dark }}>Note:</strong> Review student complaints submitted through the system.
              Monitor and address student concerns to maintain a positive school environment.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ComplaintsPage;
