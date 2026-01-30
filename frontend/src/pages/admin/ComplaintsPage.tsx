import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Alert, CircularProgress,
  Container, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import type { ComplaintData } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';

const ComplaintsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    if (!authUser?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await adminApi.getComplaintList(authUser.id);
      setComplaints(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
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

        <Typography variant="h4" fontWeight="bold" mb={3}>
          Student Complaints
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : complaints.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No complaints found
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                All caught up! No student complaints to review.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Student Name</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Complaint</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint._id}>
                    <TableCell>
                      {complaint.user ? complaint.user.name : 'Anonymous'}
                    </TableCell>
                    <TableCell>
                      {new Date(complaint.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{complaint.complaint}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default ComplaintsPage;
