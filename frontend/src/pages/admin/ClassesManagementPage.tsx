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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteAllIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import type { ClassData } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';

const ClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Classes Management
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
            >
              Create Class
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteAllIcon />}
              onClick={() => setOpenDeleteAllDialog(true)}
              disabled={classes.length === 0}
            >
              Delete All
            </Button>
          </Box>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : classes.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No classes found
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Create your first class to get started
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Class Name</strong></TableCell>
                  <TableCell><strong>Created At</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.map((classItem) => (
                  <TableRow key={classItem._id}>
                    <TableCell>{classItem.sclassName}</TableCell>
                    <TableCell>{new Date(classItem.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(classItem._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Create Class Dialog */}
        <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
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
        <Dialog open={openDeleteAllDialog} onClose={() => setOpenDeleteAllDialog(false)} maxWidth="sm" fullWidth>
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
      </Container>
    </Box>
  );
};

export default ClassesPage;
