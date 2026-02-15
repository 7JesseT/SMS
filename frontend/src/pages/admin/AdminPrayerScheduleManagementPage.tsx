import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add, Edit, Delete, AccessTime } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { prayerApi } from '../../services/api';
import type { PrayerSchedule, PrayerScheduleInput } from '../../types/entities.types';

export const AdminPrayerScheduleManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<PrayerSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<PrayerSchedule | null>(null);
  const [formData, setFormData] = useState<PrayerScheduleInput>({
    prayerName: '',
    time: '',
    description: '',
  });

  useEffect(() => {
    fetchPrayers();
  }, [user]);

  const fetchPrayers = async () => {
    if (!user?.school) return;

    try {
      setLoading(true);
      const response = await prayerApi.getAll(user.school);
      setPrayers(response.data);
    } catch (err: any) {
      setError('Failed to load prayer schedules');
    } finally {
      setLoading(false);
    }
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
      setFormData({
        prayerName: '',
        time: '',
        description: '',
      });
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
    setError('');
    setSuccess('');

    try {
      if (editingPrayer) {
        await prayerApi.update(editingPrayer._id, formData);
        setSuccess('Prayer schedule updated successfully');
      } else {
        await prayerApi.create({ ...formData, school: user!.school! });
        setSuccess('Prayer schedule created successfully');
      }
      handleCloseDialog();
      fetchPrayers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save prayer schedule');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this prayer schedule?')) return;

    try {
      await prayerApi.delete(id);
      setSuccess('Prayer schedule deleted successfully');
      fetchPrayers();
    } catch (err: any) {
      setError('Failed to delete prayer schedule');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Prayer Schedule Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Prayer
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prayer Name</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prayers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary">No prayer schedules found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              prayers.map((prayer) => (
                <TableRow key={prayer._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime fontSize="small" color="action" />
                      {prayer.prayerName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography color="primary" fontWeight="medium">
                      {prayer.time}
                    </Typography>
                  </TableCell>
                  <TableCell>{prayer.description || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleOpenDialog(prayer)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(prayer._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPrayer ? 'Edit Prayer Schedule' : 'Add Prayer Schedule'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Prayer Name"
                name="prayerName"
                value={formData.prayerName}
                onChange={handleInputChange}
                required
                placeholder="e.g., Fajr, Dhuhr, Asr"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                placeholder="Additional notes about this prayer time"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingPrayer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
