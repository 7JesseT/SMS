import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials, UserRole } from '../types';
import { loginValidationSchema } from '../utils/validators';
import { APP_NAME } from '../utils/constants';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [error, setError] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'Student' as UserRole,
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setError('');
    try {
      await login(data);
      navigate(`/${data.role.toLowerCase()}/dashboard`);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: { md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F8FAFC',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: '300px', md: '600px' },
          height: { xs: '300px', md: '600px' },
          background: 'radial-gradient(circle, rgba(33, 150, 243, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: { xs: '250px', md: '500px' },
          height: { xs: '250px', md: '500px' },
          background: 'radial-gradient(circle, rgba(33, 150, 243, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(-30%, 30%)',
        },
      }}
    >
      <Container 
        maxWidth="sm"
        sx={{
          p: { xs: 2, md: 3 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            animation: 'fadeInUp 0.6s ease-out',
            '@keyframes fadeInUp': {
              from: {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
              maxWidth: '450px',
              mx: 'auto',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.08)',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            {/* Logo/Brand Section */}
            <Box 
              sx={{ 
                textAlign: 'center',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  bgcolor: 'primary.main',
                  boxShadow: '0 8px 24px rgba(33, 150, 243, 0.25)',
                  mb: 1.5,
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                }}
              >
                <SchoolOutlinedIcon sx={{ fontSize: 28, color: 'white' }} />
              </Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: 'text.primary',
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                {APP_NAME}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              >
                Hi, Welcome back 👋
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'error.light',
                  bgcolor: 'error.lighter',
                  '& .MuiAlert-icon': {
                    color: 'error.main',
                  },
                  '& .MuiAlert-message': {
                    fontSize: '0.9rem',
                    color: 'error.dark',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                  }}
                >
                  Email Address
                </Typography>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter your email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#F8FAFC',
                          transition: 'all 0.3s ease',
                          '& fieldset': {
                            borderColor: '#E2E8F0',
                            borderWidth: 1.5,
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.light',
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white',
                            '& fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                          '&.Mui-error': {
                            bgcolor: 'white',
                            '& fieldset': {
                              borderColor: 'error.main',
                              borderWidth: 2,
                            },
                          },
                        },
                        '& input': {
                          fontSize: '0.95rem',
                          py: 1.25,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Password Field */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                  }}
                >
                  Password
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                              sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                  color: 'primary.main',
                                },
                              }}
                            >
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#F8FAFC',
                          transition: 'all 0.3s ease',
                          '& fieldset': {
                            borderColor: '#E2E8F0',
                            borderWidth: 1.5,
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.light',
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white',
                            '& fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                          '&.Mui-error': {
                            bgcolor: 'white',
                            '& fieldset': {
                              borderColor: 'error.main',
                              borderWidth: 2,
                            },
                          },
                        },
                        '& input': {
                          fontSize: '0.95rem',
                          py: 1.25,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Login As Field */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                  }}
                >
                  Login As
                </Typography>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      error={!!errors.role}
                      helperText={errors.role?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#F8FAFC',
                          transition: 'all 0.3s ease',
                          '& fieldset': {
                            borderColor: '#E2E8F0',
                            borderWidth: 1.5,
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.light',
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white',
                            '& fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: 2,
                            },
                          },
                          '&.Mui-error': {
                            bgcolor: 'white',
                            '& fieldset': {
                              borderColor: 'error.main',
                              borderWidth: 2,
                            },
                          },
                        },
                        '& .MuiSelect-select': {
                          fontSize: '0.95rem',
                          py: 1.25,
                        },
                      }}
                    >
                      <MenuItem value="Admin">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label="Admin" size="small" color="error" sx={{ fontWeight: 600 }} />
                          <Typography variant="body2">Administrator</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="Teacher">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label="Teacher" size="small" color="primary" sx={{ fontWeight: 600 }} />
                          <Typography variant="body2">Teacher</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="Student">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label="Student" size="small" color="success" sx={{ fontWeight: 600 }} />
                          <Typography variant="body2">Student</Typography>
                        </Box>
                      </MenuItem>
                    </TextField>
                  )}
                />
              </Box>

              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
                endIcon={!isLoading && <ArrowForwardIcon />}
                sx={{ 
                  mb: 2,
                  py: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                  boxShadow: '0 4px 14px rgba(33, 150, 243, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                    opacity: 0.6,
                  },
                }}
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>

              {/* Divider */}
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  or
                </Typography>
              </Divider>

              {/* Back to Home Button */}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/')}
                startIcon={<HomeOutlinedIcon />}
                sx={{ 
                  py: 1.5,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  borderWidth: 1.5,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderWidth: 1.5,
                    borderColor: 'primary.dark',
                    bgcolor: 'rgba(33, 150, 243, 0.04)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                Back to Home
              </Button>
            </form>

            {/* Demo Info Box */}
            {/* <Box 
              sx={{ 
                mt: 3, 
                p: 2,
                bgcolor: 'rgba(33, 150, 243, 0.04)',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'rgba(33, 150, 243, 0.15)',
              }}
            >
              <Typography 
                variant="body2" 
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                🎓 Demo Credentials
              </Typography>
              <Typography 
                variant="caption" 
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  lineHeight: 1.6,
                  fontSize: '0.8rem',
                }}
              >
                Use any email with password:{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'primary.main',
                    fontFamily: 'monospace',
                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  password123
                </Box>
              </Typography>
            </Box> */}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
