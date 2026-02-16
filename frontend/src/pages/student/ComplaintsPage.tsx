import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  CheckCircle as ResolvedIcon,
  HourglassEmpty as PendingIcon,
  Report as ComplaintIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStudentComplaints, useCreateComplaint } from '../../services/studentApi';
import { format } from 'date-fns';

const ComplaintsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [complaint, setComplaint] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Fetch complaints from API
  const { data: complaints, isLoading, error } = useStudentComplaints(user?.id);
  const createComplaintMutation = useCreateComplaint();

  // Get schoolId from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const schoolId = typeof currentUser.school === 'string' 
    ? currentUser.school 
    : currentUser.school?._id;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filter by search query
  const filteredComplaints = (complaints || []).filter(
    complaint =>
      complaint.complaint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by date (most recent first)
  const sortedComplaints = [...filteredComplaints].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalComplaints = complaints?.length || 0;
  const pendingComplaints = (complaints || []).filter(c => !c.updatedAt || c.updatedAt === c.createdAt).length;
  const resolvedComplaints = (complaints || []).filter(c => c.updatedAt && c.updatedAt !== c.createdAt).length;

  const handleSubmitComplaint = async () => {
    if (!complaint.trim()) {
      setSubmitError('Please enter your complaint');
      return;
    }

    if (!user?.id) {
      setSubmitError('User not authenticated');
      return;
    }

    if (!schoolId) {
      setSubmitError('School information not found');
      return;
    }

    setSubmitError('');

    try {
      await createComplaintMutation.mutateAsync({
        user: user.id,
        date: new Date().toISOString().split('T')[0],
        complaint: complaint.trim(),
        school: schoolId,
      });

      setComplaint('');
      setOpenDialog(false);
    } catch (err: any) {
      console.error('Complaint submission error:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    }
  };

  // Stat Card Component
  const StatCard = ({ icon, label, value, subtext, color = 'primary' }: any) => (
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
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
        </Box>
      </Box>
      {subtext && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {subtext}
        </Typography>
      )}
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
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ComplaintIcon sx={{ color: 'white', fontSize: isMobile ? 28 : 32 }} />
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
                My Complaints
              </Typography>
            </Stack>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                bgcolor: 'warning.main',
                color: 'warning.contrastText',
                fontWeight: 600,
                px: 3,
                py: 1.2,
                boxShadow: theme.shadows[8],
                '&:hover': {
                  bgcolor: 'warning.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[12],
                },
              }}
            >
              Submit Complaint
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Loading State */}
        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={60} thickness={4} />
              <Typography variant="body1" color="text.secondary">
                Loading complaints...
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
            {error instanceof Error ? error.message : 'Failed to load complaints'}
          </Alert>
        )}

        {/* Content - Only show when not loading */}
        {!isLoading && !error && (
          <>
            {/* Overview Cards */}
            <Grid container spacing={2.5} mb={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<ComplaintIcon sx={{ fontSize: 28 }} />}
              label="Total Complaints"
              value={totalComplaints}
              color="primary"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<PendingIcon sx={{ fontSize: 28 }} />}
              label="Pending"
              value={pendingComplaints}
              color="warning"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<ResolvedIcon sx={{ fontSize: 28 }} />}
              label="Resolved"
              value={resolvedComplaints}
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
              placeholder="Search complaints by title or description..."
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

        {/* Complaints Table */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Complaint History
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Complaint</strong></TableCell>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedComplaints.map((complaint) => {
                  const isResolved = complaint.updatedAt && complaint.updatedAt !== complaint.createdAt;
                  return (
                    <TableRow key={complaint._id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(complaint.date), 'MMM dd, yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell>
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
                          {complaint.complaint}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {complaint.user.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={isResolved ? 'Resolved' : 'Pending'}
                          color={isResolved ? 'success' : 'warning'}
                          size="small"
                          icon={isResolved ? <ResolvedIcon /> : <PendingIcon />}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {sortedComplaints.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                      <ComplaintIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        {searchQuery
                          ? 'No complaints found'
                          : 'No complaints yet'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchQuery
                          ? 'Try adjusting your search criteria'
                          : 'Click "Submit Complaint" to report an issue'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Submit Complaint Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setComplaint('');
            setSubmitError('');
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                Submit New Complaint
              </Typography>
              <IconButton 
                onClick={() => {
                  setOpenDialog(false);
                  setComplaint('');
                  setSubmitError('');
                }} 
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            <Box>
              {submitError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submitError}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Complaint Description"
                placeholder="Please describe your complaint in detail..."
                value={complaint}
                onChange={(e) => {
                  setComplaint(e.target.value);
                  setSubmitError('');
                }}
                multiline
                rows={6}
                required
                disabled={createComplaintMutation.isPending}
              />
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: 'info.lighter',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'info.main',
                }}
              >
                <Typography variant="caption" color="info.dark" fontWeight={500}>
                  💡 Tip: Please provide detailed information to help us address your concern effectively.
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setComplaint('');
                setSubmitError('');
              }}
              variant="outlined"
              sx={{ px: 3 }}
              disabled={createComplaintMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitComplaint}
              disabled={!complaint.trim() || createComplaintMutation.isPending}
              sx={{ px: 3 }}
            >
              {createComplaintMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Submit Complaint'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Info Card */}
        {totalComplaints === 0 && (
          <Card
            elevation={0}
            sx={{
              mt: 3,
              bgcolor: 'info.lighter',
              border: '1px solid',
              borderColor: 'info.main',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="start" gap={2}>
              <ComplaintIcon color="info" />
                <InfoIcon sx={{ color: 'info.main', fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="info.dark" gutterBottom>
                    How to Submit a Complaint
                  </Typography>
                  <Typography variant="body2" color="info.dark" paragraph>
                    If you're facing any issues or have concerns, you can submit a complaint by
                    clicking the "Submit Complaint" button above.
                  </Typography>
                  <Typography variant="body2" color="info.dark" fontWeight={500} gutterBottom>
                    Please provide:
                  </Typography>
                  <Box component="ul" sx={{ margin: '8px 0', paddingLeft: '24px' }}>
                    <li>
                      <Typography variant="body2" color="info.dark">
                        A clear and concise title
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="info.dark">
                        Detailed description of the issue
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" color="info.dark">
                        Any relevant details that can help us resolve the issue quickly
                      </Typography>
                    </li>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ComplaintsPage;
