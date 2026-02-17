import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Snackbar,
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  Add, 
  Edit, 
  Delete, 
  AccessTime,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Schedule as TimeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  useAdminPrayerSchedules,
  useCreatePrayerSchedule,
  useUpdatePrayerSchedule,
  useDeletePrayerSchedule,
  getApiErrorMessage,
} from '../../hooks/useAdminApi';
import type { PrayerSchedule, PrayerScheduleInput } from '../../types/entities.types';

export const AdminPrayerScheduleManagementPage: React.FC = () => {
  const { getCurrentUserData, logout } = useAuth() as any;
  const currentUserData = getCurrentUserData();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // For Admin users, the _id IS the school ID
  const schoolId = currentUserData?._id;

  // TanStack Query hooks
  const { data: prayers = [], isLoading, error: fetchError, refetch } = useAdminPrayerSchedules(schoolId);
  const createMutation = useCreatePrayerSchedule(schoolId);
  const updateMutation = useUpdatePrayerSchedule(schoolId);
  const deleteMutation = useDeletePrayerSchedule(schoolId);

  // Prayer order for sorting
  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  // Sort prayers by the defined order
  const sortedPrayers = [...prayers].sort((a, b) => {
    const aIndex = prayerOrder.indexOf(a.prayerName);
    const bIndex = prayerOrder.indexOf(b.prayerName);
    // If both prayers are in the order list, sort by their position
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    // If only one is in the list, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    // If neither is in the list, maintain original order (alphabetical)
    return a.prayerName.localeCompare(b.prayerName);
  });

  // Local UI state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<PrayerSchedule | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PrayerScheduleInput>({
    prayerName: '',
    time: '',
    description: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (prayer?: PrayerSchedule) => {
    if (prayer) {
      setEditingPrayer(prayer);
      setFormData({
        prayerName: prayer.prayerName,
        time: prayer.time,
        description: prayer.description || '',
      });
    } else {
      setEditingPrayer(null);
      setFormData({ prayerName: '', time: '', description: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPrayer(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: PrayerScheduleInput) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.prayerName.trim() || !formData.time.trim()) {
      showSnackbar('Prayer name and time are required', 'error');
      return;
    }

    try {
      if (editingPrayer) {
        await updateMutation.mutateAsync({ prayerId: editingPrayer._id, data: formData });
        showSnackbar('Prayer schedule updated successfully!', 'success');
      } else {
        await createMutation.mutateAsync({ ...formData, school: schoolId! });
        showSnackbar('Prayer schedule created successfully!', 'success');
      }
      handleCloseDialog();
    } catch (err: any) {
      showSnackbar(getApiErrorMessage(err, 'Failed to save prayer schedule'), 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmId);
      showSnackbar('Prayer schedule deleted successfully!', 'success');
      setDeleteConfirmId(null);
    } catch (err: any) {
      showSnackbar(getApiErrorMessage(err, 'Failed to delete prayer schedule'), 'error');
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Loading prayer schedules...</Typography>
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
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Add Prayer
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
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <AccessTime sx={{ fontSize: 40 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              Prayer Schedule Management
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {fetchError && (
          <Alert severity="error" sx={{ mb: 3 }} action={
            <Button color="inherit" size="small" onClick={() => refetch()}>Retry</Button>
          }>
            {getApiErrorMessage(fetchError, 'Failed to load prayer schedules. Please try again.')}
          </Alert>
        )}

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
                <AccessTime sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No prayer schedules found
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Add your first prayer schedule to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                >
                  Add First Prayer
                </Button>
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
                          <AccessTime sx={{ fontSize: 32 }} />
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

                        <Stack direction="row" spacing={1}>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(prayer)} 
                            title="Edit prayer"
                            sx={{
                              bgcolor: 'primary.lighter',
                              '&:hover': {
                                bgcolor: 'primary.light',
                              },
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => setDeleteConfirmId(prayer._id)} 
                            title="Delete prayer"
                            sx={{
                              bgcolor: 'error.lighter',
                              '&:hover': {
                                bgcolor: 'error.light',
                              },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
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
              <strong style={{ color: theme.palette.info.dark }}>Note:</strong> Manage prayer schedules for the school. 
              You can add, edit, or delete prayer times. Students and teachers will see the updated schedules.
            </Typography>
          </Stack>
        </Paper>
      </Container>

      {/* Create / Edit Dialog */}
      <Dialog open={openDialog} onClose={() => !isSaving && handleCloseDialog()} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPrayer ? 'Edit Prayer Schedule' : 'Add Prayer Schedule'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Prayer Name" name="prayerName" value={formData.prayerName} onChange={handleInputChange} required disabled={isSaving} placeholder="e.g., Fajr, Dhuhr, Mass" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Time" name="time" type="time" value={formData.time} onChange={handleInputChange} InputLabelProps={{ shrink: true }} required disabled={isSaving} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Description (Optional)" name="description" value={formData.description} onChange={handleInputChange} multiline rows={3} disabled={isSaving} placeholder="Additional notes about this prayer time" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSaving}>
            {isSaving ? <CircularProgress size={24} /> : editingPrayer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onClose={() => !deleteMutation.isPending && setDeleteConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Prayer Schedule</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this prayer schedule? This action cannot be undone.</Typography>
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
