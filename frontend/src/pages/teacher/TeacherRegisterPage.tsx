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
import { teacherApi } from '../../services/teacherApi';

// Default hidden IDs
const DEFAULT_SCHOOL_ID = '60d5f484f8d2e63a4c8b4567';
const DEFAULT_SUBJECT_ID = '60d5f484f8d2e63a4c8b456a';
const DEFAULT_CLASS_ID = '60d5f484f8d2e63a4c8b4568';

const TeacherRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
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

    setLoading(true);

    try {
      await teacherApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        school: DEFAULT_SCHOOL_ID,
        teachSubject: DEFAULT_SUBJECT_ID,
        teachSclass: DEFAULT_CLASS_ID,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/teacher/login');
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
              Teacher Registration
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
              Create your teacher account
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
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading || success}
                helperText="Use your school email address"
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
                    onClick={() => navigate('/teacher/login')}
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

export default TeacherRegisterPage;
