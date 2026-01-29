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
  School as SchoolIcon,
} from '@mui/icons-material';
import { adminApi } from '../../services/adminApi';
import { useNavigate } from 'react-router-dom';

interface AdminDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  schoolName: string;
  __v: number;
}

const AdminProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user from localStorage
  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  const fetchAdminDetails = async () => {
    if (!authUser?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await adminApi.getDetails(authUser.id);
      setAdmin(response.data);
    } catch (err: any) {
      console.error('Error fetching admin details:', err);
      setError('Failed to load admin details');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
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

  if (!admin) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error">Failed to load admin details</Alert>
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
            Admin Profile
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
                {admin.name.charAt(0).toUpperCase()}
              </Avatar>
              
              <Box flex={1}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {admin.name}
                </Typography>
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                  <Chip 
                    icon={<EmailIcon />}
                    label={admin.email} 
                    color="primary" 
                  />
                  <Chip 
                    label={admin.role} 
                    color="success" 
                  />
                  <Chip 
                    icon={<SchoolIcon />}
                    label={admin.schoolName} 
                    color="info" 
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Details Grid */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Admin ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {admin._id}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {admin.email}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      School Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {admin.schoolName}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Role
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {admin.role}
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

export default AdminProfilePage;
