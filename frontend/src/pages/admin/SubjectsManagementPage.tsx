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
  MenuItem,
  useTheme,
  useMediaQuery,
  Stack,
  List,
  ListItem,
  Divider,
  Snackbar,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Subject as SubjectIcon,
  School as SchoolIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import type { SubjectData, ClassData } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';

const SubjectsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
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

  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');

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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Loading subjects...</Typography>
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
                Add Subject
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
            <SubjectIcon sx={{ fontSize: 40 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              Subjects Management
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
                <SubjectIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {subjects.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Subjects
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
                Available Classes
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
                Add New Subject
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Subjects List Card */}
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
            {subjects.length === 0 ? (
              <Box p={8} textAlign="center">
                <SubjectIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No subjects found
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Create your first subject to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenCreateDialog(true)}
                >
                  Add First Subject
                </Button>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {subjects.map((subject, index) => (
                  <React.Fragment key={subject._id}>
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
                          <SubjectIcon sx={{ fontSize: 32 }} />
                        </Box>

                        <Box flex={1} textAlign={isSmallScreen ? 'center' : 'left'}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {subject.subName}
                          </Typography>
                          <Stack
                            direction={isSmallScreen ? 'column' : 'row'}
                            spacing={2}
                            alignItems={isSmallScreen ? 'center' : 'flex-start'}
                          >
                            <Chip
                              icon={<CodeIcon />}
                              label={`Code: ${subject.subCode}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label={`${subject.sessions} Sessions`}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">
                              Created {new Date(subject.createdAt).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Box>

                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(subject._id)}
                          title="Delete subject"
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
                    {index < subjects.length - 1 && <Divider />}
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
              <strong style={{ color: theme.palette.info.dark }}>Note:</strong> Manage subjects for the school.
              You can add or delete subjects. Students are enrolled in these subjects.
            </Typography>
          </Stack>
        </Paper>

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
      </Container>
    </Box>
  );
};

export default SubjectsManagementPage;
