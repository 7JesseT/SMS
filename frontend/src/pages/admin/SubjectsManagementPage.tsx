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
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import type { SubjectData, ClassData } from '../../services/adminApi';

const SubjectsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subName: '',
    subCode: '',
    sessions: '',
    sclassName: '',
  });
  const [creating, setCreating] = useState(false);

  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  const fetchSubjects = async () => {
    if (!authUser?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await adminApi.getAllSubjects(authUser.id);
      setSubjects(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Error fetching subjects:', err);
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await adminApi.getClassList(authUser.id);
      setClasses(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Error fetching classes:', err);
    }
  };

  const handleCreateSubject = async () => {
    if (!formData.subName.trim() || !formData.subCode.trim() || !formData.sessions.trim() || !formData.sclassName) {
      setError('All fields are required');
      return;
    }

    setCreating(true);
    setError('');

    try {
      await adminApi.createSubject({
        subjects: [{
          subName: formData.subName.trim(),
          subCode: formData.subCode.trim(),
          sessions: formData.sessions.trim(),
        }],
        sclassName: formData.sclassName,
        adminID: authUser.id,
      });

      setSuccess('Subject created successfully!');
      setFormData({ subName: '', subCode: '', sessions: '', sclassName: '' });
      setOpenCreateDialog(false);
      fetchSubjects();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create subject');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setSubjectToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteSubject = async () => {
    if (!subjectToDelete) return;

    try {
      await adminApi.deleteSubject(subjectToDelete);
      setSuccess('Subject deleted successfully!');
      setOpenDeleteDialog(false);
      setSubjectToDelete(null);
      fetchSubjects();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete subject');
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
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
          <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">Subjects Management</Typography>
          <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => setOpenCreateDialog(true)}>
            Create Subject
          </Button>
        </Box>

        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : subjects.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">No subjects found</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>Create your first subject to get started</Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Subject Name</strong></TableCell>
                  <TableCell><strong>Code</strong></TableCell>
                  <TableCell><strong>Sessions</strong></TableCell>
                  <TableCell><strong>Created At</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject._id}>
                    <TableCell>{subject.subName}</TableCell>
                    <TableCell>{subject.subCode}</TableCell>
                    <TableCell>{subject.sessions}</TableCell>
                    <TableCell>{new Date(subject.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(subject._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Subject</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Subject Name"
              value={formData.subName}
              onChange={(e) => setFormData({ ...formData, subName: e.target.value })}
              margin="normal"
              disabled={creating}
            />
            <TextField
              fullWidth
              label="Subject Code"
              value={formData.subCode}
              onChange={(e) => setFormData({ ...formData, subCode: e.target.value })}
              margin="normal"
              disabled={creating}
            />
            <TextField
              fullWidth
              label="Number of Sessions"
              value={formData.sessions}
              onChange={(e) => setFormData({ ...formData, sessions: e.target.value })}
              margin="normal"
              type="number"
              disabled={creating}
            />
            <TextField
              fullWidth
              select
              label="Class"
              value={formData.sclassName}
              onChange={(e) => setFormData({ ...formData, sclassName: e.target.value })}
              margin="normal"
              disabled={creating}
            >
              {classes.map((classItem) => (
                <MenuItem key={classItem._id} value={classItem._id}>
                  {classItem.sclassName}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateDialog(false)} disabled={creating}>Cancel</Button>
            <Button onClick={handleCreateSubject} variant="contained" disabled={creating}>
              {creating ? <CircularProgress size={24} /> : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Subject Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Delete Subject</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this subject? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSubject}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SubjectsManagementPage;
