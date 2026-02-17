import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Snackbar,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
  Paper,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  Add, 
  Edit, 
  Delete, 
  CalendarMonth as CalendarIcon,
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  useAdminCalendarEvents,
  useCreateCalendarEvent,
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
  getApiErrorMessage,
} from '../../hooks/useAdminApi';
import type { AcademicCalendar, AcademicCalendarInput } from '../../types/entities.types';

const eventTypeColors: Record<string, 'primary' | 'success' | 'error' | 'warning' | 'info'> = {
  Exam: 'error',
  Examination: 'error',
  Holiday: 'success',
  Event: 'primary',
  Term: 'warning',
  Other: 'info',
};

export const AdminCalendarManagementPage: React.FC = () => {
  const { user, getCurrentUserData, logout } = useAuth() as any;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const currentUserData = getCurrentUserData();
  // For Admin users, the _id IS the school ID
  const schoolId = currentUserData?._id;

  // TanStack Query hooks
  const { data: events = [], isLoading, error: fetchError, refetch } = useAdminCalendarEvents(schoolId);
  const createMutation = useCreateCalendarEvent(schoolId);
  const updateMutation = useUpdateCalendarEvent(schoolId);
  const deleteMutation = useDeleteCalendarEvent(schoolId);

  // Local UI state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AcademicCalendar | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AcademicCalendarInput>({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    eventType: 'Event',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getEventTypeColor = (type: string): 'error' | 'warning' | 'info' | 'success' | 'default' => {
    switch (type) {
      case 'Exam':
      case 'Examination':
        return 'error';
      case 'Holiday':
        return 'success';
      case 'Event':
        return 'primary';
      case 'Term':
        return 'warning';
      default:
        return 'info';
    }
  };

  const handleOpenDialog = (event?: AcademicCalendar) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        startDate: format(new Date(event.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(event.endDate), 'yyyy-MM-dd'),
        eventType: event.eventType,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        eventType: 'Event',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: AcademicCalendarInput) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      showSnackbar('Title and description are required', 'error');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      showSnackbar('End date cannot be before start date', 'error');
      return;
    }

    try {
      if (editingEvent) {
        await updateMutation.mutateAsync({ eventId: editingEvent._id, data: formData });
        showSnackbar('Calendar event updated successfully!', 'success');
      } else {
        await createMutation.mutateAsync({ ...formData, school: schoolId! });
        showSnackbar('Calendar event created successfully!', 'success');
      }
      handleCloseDialog();
    } catch (err: any) {
      showSnackbar(getApiErrorMessage(err, 'Failed to save calendar event'), 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmId);
      showSnackbar('Calendar event deleted successfully!', 'success');
      setDeleteConfirmId(null);
    } catch (err: any) {
      showSnackbar(getApiErrorMessage(err, 'Failed to delete calendar event'), 'error');
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Sort events by start date
  const sortedEvents = [...(events || [])].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

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
    </Paper>
  );

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
            Loading calendar...
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
              onClick={() => navigate('/admin/dashboard')}
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

          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <CalendarIcon sx={{ color: 'white', fontSize: isMobile ? 28 : 32 }} />
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
                Academic Calendar
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color="success"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Add Event
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {fetchError && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }} 
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>Retry</Button>
            }
          >
            {getApiErrorMessage(fetchError, 'Failed to load calendar events. Please try again.')}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={2.5} mb={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<CalendarIcon sx={{ fontSize: 28 }} />}
              label="Total Events"
              value={events?.length || 0}
              color="primary"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<EventIcon sx={{ fontSize: 28 }} />}
              label="Exams"
              value={events?.filter(e => e.eventType === 'Exam' || e.eventType === 'Examination').length || 0}
              color="error"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<EventIcon sx={{ fontSize: 28 }} />}
              label="Holidays"
              value={events?.filter(e => e.eventType === 'Holiday').length || 0}
              color="success"
            />
          </Grid>
        </Grid>

        {/* Events List */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {sortedEvents.length === 0 ? (
              <Box p={8} textAlign="center">
                <CalendarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No events scheduled yet
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Academic calendar events will appear here
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                >
                  Add First Event
                </Button>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {sortedEvents.map((event, index) => (
                  <React.Fragment key={event._id}>
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
                      <Box flex={1}>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1.5} flexWrap="wrap" gap={1}>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 1.5,
                                bgcolor: `${getEventTypeColor(event.eventType)}.lighter`,
                                color: `${getEventTypeColor(event.eventType)}.main`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <EventIcon sx={{ fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" fontWeight="bold">
                              {event.title}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={event.eventType}
                              color={getEventTypeColor(event.eventType)}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                            <IconButton 
                              color="primary" 
                              size="small" 
                              onClick={() => handleOpenDialog(event)} 
                              title="Edit event"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              size="small" 
                              onClick={() => setDeleteConfirmId(event._id)} 
                              title="Delete event"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        <Typography variant="body1" color="text.secondary" mb={2.5} sx={{ ml: 0.5 }}>
                          {event.description}
                        </Typography>

                        <Box display="flex" gap={3} flexWrap="wrap" sx={{ ml: 0.5 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" fontWeight={500}>
                              Start Date
                            </Typography>
                            <Typography variant="body2" fontWeight={600} mt={0.5}>
                              {format(new Date(event.startDate), 'MMMM dd, yyyy')}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" fontWeight={500}>
                              End Date
                            </Typography>
                            <Typography variant="body2" fontWeight={600} mt={0.5}>
                              {format(new Date(event.endDate), 'MMMM dd, yyyy')}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" fontWeight={500}>
                              Duration
                            </Typography>
                            <Typography variant="body2" fontWeight={600} mt={0.5}>
                              {Math.ceil(
                                (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / 
                                (1000 * 60 * 60 * 24)
                              ) + 1} days
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < sortedEvents.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Create / Edit Dialog */}
      <Dialog open={openDialog} onClose={() => !isSaving && handleCloseDialog()} maxWidth="md" fullWidth>
        <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleInputChange} required disabled={isSaving} placeholder="e.g. Mid-Term Examinations" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Event Type</InputLabel>
                <Select
                  name="eventType"
                  value={formData.eventType}
                  onChange={(e) => setFormData((prev: AcademicCalendarInput) => ({ ...prev, eventType: e.target.value as any }))}
                  label="Event Type"
                  disabled={isSaving}
                >
                  <MenuItem value="Exam">Exam</MenuItem>
                  <MenuItem value="Holiday">Holiday</MenuItem>
                  <MenuItem value="Event">Event</MenuItem>
                  <MenuItem value="Term">Term</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} />

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} required disabled={isSaving} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} required disabled={isSaving} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleInputChange} multiline rows={4} required disabled={isSaving} placeholder="Describe the event..." />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSaving}>
            {isSaving ? <CircularProgress size={24} /> : editingEvent ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onClose={() => !deleteMutation.isPending && setDeleteConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Calendar Event</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this calendar event? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)} disabled={deleteMutation.isPending}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
