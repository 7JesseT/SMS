import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Container,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { studentApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface StudentDetails {
  _id: string;
  name: string;
  rollNum: number;
  sclassName: any;
  school: any;
  role: string;
  examResult: any[];
  attendance: any[];
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await studentApi.getDetails(user.id);
      setStudent(response.data);
      setEditedName(response.data.name);
    } catch (err: any) {
      console.error('Error fetching student details:', err);
      setError('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedName(student?.name || '');
    setError('');
  };

  const handleSave = async () => {
    if (!editedName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (!user?.id) return;

    setSaving(true);
    setError('');

    try {
      const response = await studentApi.update(user.id, { name: editedName.trim() });
      setStudent(response.data);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      
      // Update user name in localStorage
      const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
      authUser.name = editedName.trim();
      localStorage.setItem('authUser', JSON.stringify(authUser));

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error updating student:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error">Failed to load student details</Alert>
        </Container>
      </Box>
    );
  }

const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header with Back and Logout */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/student/dashboard')}
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
          Student Details
        </Typography>
        {!editing && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        )}
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

      <Card>
        <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="start" gap={3}>
                <Avatar
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: 'primary.main', 
                    fontSize: '2.5rem' 
                  }}
                >
                  {student.name.charAt(0).toUpperCase()}
                </Avatar>
                
                <Box flex={1}>
                  {!editing ? (
                    <>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {student.name}
                      </Typography>
                      <Box display="flex" gap={1} mb={2}>
                        <Chip 
                          icon={<PersonIcon />}
                          label={`Roll No: ${student.rollNum}`} 
                          color="primary" 
                        />
                        <Chip 
                          label={student.role} 
                          color="success" 
                        />
                      </Box>
                    </>
                  ) : (
                    <Box mb={2}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        disabled={saving}
                        sx={{ mb: 2 }}
                      />
                      <Box display="flex" gap={1}>
                        <Chip 
                          icon={<PersonIcon />}
                          label={`Roll No: ${student.rollNum}`} 
                          color="primary" 
                        />
                        <Chip 
                          label={student.role} 
                          color="success" 
                        />
                      </Box>
                    </Box>
                  )}

                  <Divider sx={{ my: 3 }} />

                  {/* Details Grid */}
                  <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Student ID
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student._id}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Roll Number
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.rollNum}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Class
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.sclassName?.sclassName || 'Not assigned'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Subjects
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.examResult?.length || 0}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Attendance Records
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.attendance?.length || 0}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Exam Results
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {student.examResult?.length || 0}
                      </Typography>
                    </Box>
                  </Box>

                  {editing && (
                    <Box display="flex" gap={2} mt={4}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        onClick={handleSave}
                        disabled={saving || !editedName.trim()}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
