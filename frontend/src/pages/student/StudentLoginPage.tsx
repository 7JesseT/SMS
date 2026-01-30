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
import { useAuth } from '../../context/AuthContext';

const StudentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginStudent } = useAuth() as ReturnType<typeof useAuth> & {
    loginStudent: (rollNum: number, studentName: string, password: string) => Promise<void>;
  };
  const [formData, setFormData] = useState({
    name: '',
    rollNum: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    const rollNumValue = parseInt(formData.rollNum);
    if (isNaN(rollNumValue) || rollNumValue <= 0) {
      setError('Roll number must be a valid positive number');
      return;
    }

    setLoading(true);

    try {
      await loginStudent(rollNumValue, formData.name, formData.password);
      navigate('/student/dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setError(errorMessage);
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
              Student Login
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
              Welcome back! Please login to your account
            </Typography>

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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <MuiLink
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => navigate('/register')}
                    sx={{ textDecoration: 'none', fontWeight: 600 }}
                  >
                    Register here
                  </MuiLink>
                </Typography>
              </Box>

              <Box textAlign="center" mt={2}>
                <MuiLink
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => navigate('/')}
                  sx={{ textDecoration: 'none' }}
                >
                  Back to Home
                </MuiLink>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default StudentLoginPage;
