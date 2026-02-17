import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Container,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  Stack,
  List,
  ListItem,
  Divider,
  Snackbar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteAllIcon,
  Class as ClassIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import type { ClassData } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';

const ClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [className, setClassName] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Get user from localStorage
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    if (!authUser?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await adminApi.getClassList(authUser.id);
      setClasses(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async () => {
    if (!className.trim()) {
      setError('Class name is required');
      return;
    }

    setCreating(true);
    setError('');

    try {
      await adminApi.createClass({
        sclassName: className.trim(),
        adminID: authUser.id,
      });

      setSuccess('Class created successfully!');
      setClassName('');
      setOpenCreateDialog(false);
      fetchClasses();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create class');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setClassToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClass = async () => {
    if (!classToDelete) return;

    try {
      await adminApi.deleteClass(classToDelete);
      setSuccess('Class deleted successfully!');
      setOpenDeleteDialog(false);
      setClassToDelete(null);
      fetchClasses();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete class');
    }
  };

  const handleDeleteAllClasses = async () => {
    setDeleting(true);
    setError('');

    try {
      const response = await adminApi.deleteAllClasses(authUser.id);
      setSuccess(`${response.data.deletedCount} classes deleted successfully!`);
      setOpenDeleteAllDialog(false);
      fetchClasses();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete all classes');
    } finally {
      setDeleting(false);
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
        <Typography ml={2}>Loading classes...</Typography>
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
                onClick={() => setOpenCreateDialog(true)}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Add Class
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteAllIcon />}
                onClick={() => setOpenDeleteAllDialog(true)}
                disabled={classes.length === 0}
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
            <ClassIcon sx={{ fontSize: 40 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              Classes Management
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
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
                <ClassIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {classes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Classes
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
                <SchoolIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {classes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Classes
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Classes List Card */}
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
            {classes.length === 0 ? (
              <Box p={8} textAlign="center">
                <ClassIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No classes found
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Create your first class to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenCreateDialog(true)}
                >
                  Add First Class
                </Button>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {classes.map((classItem, index) => (
                  <React.Fragment key={classItem._id}>
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
                          <ClassIcon sx={{ fontSize: 32 }} />
                        </Box>

                        <Box flex={1} textAlign={isSmallScreen ? 'center' : 'left'}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {classItem.sclassName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Created on {new Date(classItem.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(classItem._id)}
                          title="Delete class"
                          sx={{
                            bgcolor: 'error.lighter',
                            '&:hover': {
                              bgcolor: 'error.light',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < classes.length - 1 && <Divider />}
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
            <SchoolIcon sx={{ color: 'info.main', mt: 0.2 }} />
            <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
              <strong style={{ color: theme.palette.info.dark }}>Note:</strong> Manage classes for the school.
              You can add or delete classes. Students and subjects are associated with these classes.
            </Typography>
          </Stack>
        </Paper>
      </Container>

      {/* Create Class Dialog */}
      <Dialog open={openCreateDialog} onClose={() => !creating && setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Class</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Class Name"
            value={className}
            onChange={(e) => {
              setClassName(e.target.value);
              setError('');
            }}
            margin="normal"
            placeholder="e.g., Primary One, Grade 5"
            disabled={creating}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)} disabled={creating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateClass}
            variant="contained"
            disabled={creating || !className.trim()}
          >
            {creating ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Single Class Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Class</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this class? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteClass}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete All Dialog */}
      <Dialog open={openDeleteAllDialog} onClose={() => !deleting && setOpenDeleteAllDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete All Classes</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Warning:</strong> This action cannot be undone!
          </Alert>
          <Typography>
            Are you sure you want to delete all {classes.length} classes? This will permanently remove all class data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteAllDialog(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAllClasses}
            variant="contained"
            color="error"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : 'Delete All'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={!!success || !!error}
        autoHideDuration={4000}
        onClose={() => {
          setSuccess('');
          setError('');
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => {
            setSuccess('');
            setError('');
          }}
          severity={success ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClassesPage;
