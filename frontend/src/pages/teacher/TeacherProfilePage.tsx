import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Container,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { teacherApi } from '../../services/teacherApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface TeacherDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  school: any;
  teachSubject: any;
  teachSclass: any;
  attendance: any[];
  createdAt: string;
  updatedAt: string;
}

const TeacherProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [teacher, setTeacher] = useState<TeacherDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user from localStorage
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');

  useEffect(() => {
    fetchTeacherDetails();
  }, []);

  const fetchTeacherDetails = async () => {
    if (!authUser?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await teacherApi.getDetails(authUser.id);
      setTeacher(response.data);
    } catch (err: any) {
      console.error('Error fetching teacher details:', err);
      setError('Failed to load teacher details');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
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

  if (!teacher) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error">Failed to load teacher details</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header with Back and Logout */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/teacher/dashboard')}
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
            Teacher Profile
          </Typography>
        </Box>

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
                {teacher.name.charAt(0).toUpperCase()}
              </Avatar>
              
              <Box flex={1}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {teacher.name}
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip 
                    icon={<EmailIcon />}
                    label={teacher.email} 
                    color="primary" 
                  />
                  <Chip 
                    label={teacher.role} 
                    color="success" 
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Details Grid */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Teacher ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {teacher._id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {teacher.email}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Teaching Subject
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {teacher.teachSubject?.subName || 'Not assigned'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Teaching Class
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {teacher.teachSclass?.sclassName || 'Not assigned'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Attendance Records
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {teacher.attendance?.length || 0}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Member Since
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(teacher.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TeacherProfilePage;
