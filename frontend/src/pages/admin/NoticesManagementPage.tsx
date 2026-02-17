import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Alert, CircularProgress, Container,
  Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar,
  useTheme, useMediaQuery, Stack, List, ListItem, Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ArrowBack as ArrowBackIcon, Logout as LogoutIcon, Add as AddIcon,
  Delete as DeleteIcon, DeleteSweep as DeleteAllIcon, Edit as EditIcon,
  Campaign as NoticeIcon, CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  useAdminNotices,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
  useDeleteAllNotices,
  getApiErrorMessage,
} from '../../hooks/useAdminApi';
import type { NoticeData } from '../../services/adminApi';

const NoticesManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');
  const adminId = authUser?.id;

  // TanStack Query hooks
  const { data: notices = [], isLoading, error: fetchError, refetch } = useAdminNotices(adminId);
  const createNoticeMutation = useCreateNotice();
  const updateNoticeMutation = useUpdateNotice(adminId);
  const deleteNoticeMutation = useDeleteNotice(adminId);
  const deleteAllMutation = useDeleteAllNotices(adminId);

  // Local UI state
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<string | null>(null);
  const [editingNotice, setEditingNotice] = useState<NoticeData | null>(null);
  const [formData, setFormData] = useState({ title: '', details: '', date: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
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
      showSnackbar('All fields (title, details, date) are required', 'error');
      return;
    }

    try {
      if (editingNotice) {
        await updateNoticeMutation.mutateAsync({ noticeId: editingNotice._id, data: formData });
        showSnackbar('Notice updated successfully!', 'success');
      } else {
        await createNoticeMutation.mutateAsync({ ...formData, adminID: adminId });
        showSnackbar('Notice created successfully!', 'success');
      }
      setOpenDialog(false);
      setFormData({ title: '', details: '', date: '' });
      setEditingNotice(null);
    } catch (err: any) {
      showSnackbar(getApiErrorMessage(err, editingNotice ? 'Failed to update notice' : 'Failed to create notice'), 'error');
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setNoticeToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteNotice = async () => {
    if (!noticeToDelete) return;
    try {
      await deleteNoticeMutation.mutateAsync(noticeToDelete);
      showSnackbar('Notice deleted successfully!', 'success');
      setOpenDeleteDialog(false);
      setNoticeToDelete(null);
    } catch (err: any) {
      showSnackbar(getApiErrorMessage(err, 'Failed to delete notice'), 'error');
    }
  };

  const handleDeleteAllNotices = async () => {
    try {
      const response = await deleteAllMutation.mutateAsync();
      const count = response.data?.deletedCount ?? 0;
      showSnackbar(`${count} notice${count !== 1 ? 's' : ''} deleted successfully!`, 'success');
      setOpenDeleteAllDialog(false);
    } catch (err: any) {
      showSnackbar(getApiErrorMessage(err, 'Failed to delete all notices'), 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isSaving = createNoticeMutation.isPending || updateNoticeMutation.isPending;
  const isDeleting = deleteNoticeMutation.isPending;
  const isDeletingAll = deleteAllMutation.isPending;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Loading notices...</Typography>
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
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Add Notice
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteAllIcon />}
                onClick={() => setOpenDeleteAllDialog(true)}
                disabled={notices.length === 0}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(244,67,54,0.8)',
                    bgcolor: 'rgba(244,67,54,0.1)',
                  },
                  '&.Mui-disabled': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Delete All
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
            <NoticeIcon sx={{ fontSize: 40 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              Notices Management
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {fetchError && (
          <Alert severity="error" sx={{ mb: 3 }} action={
            <Button color="inherit" size="small" onClick={() => refetch()}>Retry</Button>
          }>
            {getApiErrorMessage(fetchError, 'Failed to load notices. Please check your connection and try again.')}
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
                <NoticeIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {notices.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Notices
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
                <CalendarIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {notices.filter(n => new Date(n.date) >= new Date()).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Notices
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
                <AddIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                +
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add New Notice
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Notices List Card */}
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
            {notices.length === 0 && !fetchError ? (
              <Box p={8} textAlign="center">
                <NoticeIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No notices found
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Create your first notice to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Add First Notice
                </Button>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notices.map((notice, index) => (
                  <React.Fragment key={notice._id}>
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
                          <NoticeIcon sx={{ fontSize: 32 }} />
                        </Box>

                        <Box flex={1} textAlign={isSmallScreen ? 'center' : 'left'}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {notice.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mb={1} sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}>
                            {notice.details}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notice.date).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(notice)}
                            title="Edit notice"
                            sx={{
                              bgcolor: 'primary.lighter',
                              '&:hover': {
                                bgcolor: 'primary.light',
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(notice._id)}
                            title="Delete notice"
                            sx={{
                              bgcolor: 'error.lighter',
                              '&:hover': {
                                bgcolor: 'error.light',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </Box>
                    </ListItem>
                    {index < notices.length - 1 && <Divider />}
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
            <NoticeIcon sx={{ color: 'info.main', mt: 0.2 }} />
            <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
              <strong style={{ color: theme.palette.info.dark }}>Note:</strong> Manage notices for the school.
              You can create, edit, or delete notices. Students and teachers will see these announcements.
            </Typography>
          </Stack>
        </Paper>

        {/* Create / Edit Dialog */}
        <Dialog open={openDialog} onClose={() => !isSaving && setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingNotice ? 'Update Notice' : 'Create New Notice'}</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} margin="normal" disabled={isSaving} placeholder="e.g. Important School Assembly" />
            <TextField fullWidth label="Details" value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} margin="normal" multiline rows={3} disabled={isSaving} placeholder="Enter the notice details..." />
            <TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} disabled={isSaving} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSaveNotice} variant="contained" disabled={isSaving}>
              {isSaving ? <CircularProgress size={24} /> : editingNotice ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Single Notice Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => !isDeleting && setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Delete Notice</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this notice? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} disabled={isDeleting}>Cancel</Button>
            <Button onClick={handleDeleteNotice} variant="contained" color="error" disabled={isDeleting}>
              {isDeleting ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete All Notices Dialog */}
        <Dialog open={openDeleteAllDialog} onClose={() => !isDeletingAll && setOpenDeleteAllDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Delete All Notices</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}><strong>Warning:</strong> This action cannot be undone!</Alert>
            <Typography>Are you sure you want to delete all {notices.length} notices?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteAllDialog(false)} disabled={isDeletingAll}>Cancel</Button>
            <Button onClick={handleDeleteAllNotices} variant="contained" color="error" disabled={isDeletingAll}>
              {isDeletingAll ? <CircularProgress size={24} /> : 'Delete All'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for success/error messages */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default NoticesManagementPage;
