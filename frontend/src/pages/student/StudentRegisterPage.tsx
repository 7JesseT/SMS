import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Link as MuiLink,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../../services/api';

// Default hidden IDs
const DEFAULT_CLASS_ID = '60d5f484f8d2e63a4c8b4568';
const DEFAULT_ADMIN_ID = '60d5f484f8d2e63a4c8b4567';

const StudentRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    rollNum: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.rollNum || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const rollNumValue = parseInt(formData.rollNum);
    if (isNaN(rollNumValue) || rollNumValue <= 0) {
      setError('Roll number must be a valid positive number');
      return;
    }

    setLoading(true);

    try {
      await studentApi.register({
        name: formData.name,
        rollNum: rollNumValue,
        password: formData.password,
        sclassName: DEFAULT_CLASS_ID,
        adminID: DEFAULT_ADMIN_ID,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={8}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1}>
              Student Registration
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
              Create your student account
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Registration successful! Redirecting to login...
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading || success}
              />

              <TextField
                fullWidth
                label="Roll Number"
                name="rollNum"
                type="number"
                value={formData.rollNum}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading || success}
                helperText="Your unique student roll number"
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading || success}
                helperText="Minimum 6 characters"
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading || success}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || success}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Register'}
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <MuiLink
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => navigate('/login')}
                    sx={{ textDecoration: 'none', fontWeight: 600 }}
                  >
                    Login here
                  </MuiLink>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default StudentRegisterPage;
