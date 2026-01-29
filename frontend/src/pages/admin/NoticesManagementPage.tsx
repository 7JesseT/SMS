import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Alert, CircularProgress, Container,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Logout as LogoutIcon, Add as AddIcon,
  Delete as DeleteIcon, DeleteSweep as DeleteAllIcon, Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import type { NoticeData } from '../../services/adminApi';

const NoticesManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<string | null>(null);
  const [editingNotice, setEditingNotice] = useState<NoticeData | null>(null);
  const [formData, setFormData] = useState({ title: '', details: '', date: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    if (!authUser?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await adminApi.getNoticeList(authUser.id);
      setNotices(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Error fetching notices:', err);
      setError('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (notice?: NoticeData) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        details: notice.details,
        date: notice.date.split('T')[0],
      });
    } else {
      setEditingNotice(null);
      setFormData({ title: '', details: '', date: '' });
    }
    setOpenDialog(true);
  };

  const handleSaveNotice = async () => {
    if (!formData.title.trim() || !formData.details.trim() || !formData.date) {
      setError('All fields are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (editingNotice) {
        await adminApi.updateNotice(editingNotice._id, formData);
        setSuccess('Notice updated successfully!');
      } else {
        await adminApi.createNotice({ ...formData, adminID: authUser.id });
        setSuccess('Notice created successfully!');
      }

      setFormData({ title: '', details: '', date: '' });
      setOpenDialog(false);
      fetchNotices();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save notice');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setNoticeToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteNotice = async () => {
    if (!noticeToDelete) return;

    try {
      await adminApi.deleteNotice(noticeToDelete);
      setSuccess('Notice deleted successfully!');
      setOpenDeleteDialog(false);
      setNoticeToDelete(null);
      fetchNotices();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete notice');
    }
  };

  const handleDeleteAllNotices = async () => {
    setDeleting(true);
    setError('');

    try {
      const response = await adminApi.deleteAllNotices(authUser.id);
      setSuccess(`${response.data.deletedCount} notices deleted successfully!`);
      setOpenDeleteAllDialog(false);
      fetchNotices();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete all notices');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
          <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>Logout</Button>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">Notices Management</Typography>
          <Box display="flex" gap={2}>
            <Button variant="contained" color="warning" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Create Notice</Button>
            <Button variant="outlined" color="error" startIcon={<DeleteAllIcon />} onClick={() => setOpenDeleteAllDialog(true)} disabled={notices.length === 0}>Delete All</Button>
          </Box>
        </Box>

        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : notices.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">No notices found</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>Create your first notice to get started</Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Details</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notices.map((notice) => (
                  <TableRow key={notice._id}>
                    <TableCell>{notice.title}</TableCell>
                    <TableCell>{notice.details}</TableCell>
                    <TableCell>{new Date(notice.date).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenDialog(notice)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(notice._id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingNotice ? 'Update Notice' : 'Create New Notice'}</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} margin="normal" disabled={saving} />
            <TextField fullWidth label="Details" value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} margin="normal" multiline rows={3} disabled={saving} />
            <TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} disabled={saving} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSaveNotice} variant="contained" disabled={saving}>{saving ? <CircularProgress size={24} /> : editingNotice ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Single Notice Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Delete Notice</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this notice? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteNotice}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteAllDialog} onClose={() => setOpenDeleteAllDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Delete All Notices</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}><strong>Warning:</strong> This action cannot be undone!</Alert>
            <Typography>Are you sure you want to delete all {notices.length} notices?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteAllDialog(false)} disabled={deleting}>Cancel</Button>
            <Button onClick={handleDeleteAllNotices} variant="contained" color="error" disabled={deleting}>{deleting ? <CircularProgress size={24} /> : 'Delete All'}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default NoticesManagementPage;
