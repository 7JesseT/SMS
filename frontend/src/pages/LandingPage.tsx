import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import Grid from "@mui/material/Grid";
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState<'register' | 'login'>('login');

  const benefits = [
    'Save 10+ hours per week on administrative tasks',
    'Improve student outcomes with data-driven insights',
    'Seamless integration with existing systems',
    'Dedicated support team available 24/7',
  ];

  const handleOpenDialog = (type: 'register' | 'login') => {
    setActionType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUserTypeSelect = (userType: 'Student' | 'Teacher' | 'Admin') => {
    setOpenDialog(false);
    if (userType === 'Student') {
      if (actionType === 'register') {
        navigate('/register');
      } else {
        navigate('/login');
      }
    } else {
      // For Teacher and Admin, redirect to login for now
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '100vh', md: '100vh' },
          height: { md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://res.cloudinary.com/df3lhzzy7/image/upload/v1769500206/pexels-rdne-8500353_qxuukh.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.6)',
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.45) 0%, rgba(13, 71, 161, 0.15) 100%)',
            zIndex: 1,
          },
        }}
      >
        {/* Animated Background Patterns */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: { xs: '400px', md: '600px' },
            height: { xs: '400px', md: '600px' },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(60px)',
            zIndex: 2,
            animation: 'float 8s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '50%': { transform: 'translate(-30px, -30px) scale(1.1)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: { xs: '350px', md: '500px' },
            height: { xs: '350px', md: '500px' },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(60px)',
            zIndex: 2,
            animation: 'floatReverse 10s ease-in-out infinite',
            '@keyframes floatReverse': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '50%': { transform: 'translate(30px, 30px) scale(1.15)' },
            },
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 3,
            py: { xs: 8, md: 0 },
          }}
        >
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Hero Content */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  animation: 'fadeInUp 0.8s ease-out',
                  '@keyframes fadeInUp': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(40px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                {/* Trust Badge */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(10px)',
                    px: 3,
                    py: 1,
                    borderRadius: 50,
                    mb: { xs: 3, md: 2 },
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: '#4caf50',
                      boxShadow: '0 0 10px #4caf50',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                        '50%': { opacity: 0.6, transform: 'scale(0.95)' },
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      fontSize: { xs: '0.85rem', md: '0.9rem' },
                      letterSpacing: '0.3px',
                    }}
                  >
                    Trusted by 500+ Schools Worldwide
                  </Typography>
                </Box>

                {/* Main Heading */}
                <Typography
                  variant="h1"
                  sx={{
                    color: 'white',
                    mb: { xs: 3, md: 2 },
                    fontSize: { xs: '2.75rem', sm: '3.75rem', md: '4rem', lg: '4.5rem' },
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: { xs: 1.15, md: 1.1 },
                    textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                  }}
                >
                  {APP_NAME}
                </Typography>

                {/* Subtitle */}
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.95)',
                    mb: { xs: 5, md: 3 },
                    fontSize: { xs: '1.15rem', md: '1.25rem' },
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '650px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  }}
                >
                  Transform your educational institution with our comprehensive, cloud-based management platform designed for modern schools
                </Typography>

                {/* Benefits List */}
                <Box
                  sx={{
                    mb: { xs: 5, md: 3 },
                    display: { xs: 'none', md: 'block' },
                  }}
                >
                  {benefits.map((benefit, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 1.5,
                        animation: `fadeInLeft 0.6s ease-out ${0.3 + index * 0.1}s backwards`,
                        '@keyframes fadeInLeft': {
                          from: {
                            opacity: 0,
                            transform: 'translateX(-30px)',
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateX(0)',
                          },
                        },
                      }}
                    >
                      <CheckCircleOutlineIcon
                        sx={{
                          color: '#4caf50',
                          fontSize: 22,
                          filter: 'drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))',
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255,255,255,0.95)',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                        }}
                      >
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* CTA Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2.5,
                    flexWrap: 'wrap',
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleOpenDialog('register')}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: { xs: 4, md: 5 },
                      py: { xs: 1.8, md: 1.75 },
                      fontSize: { xs: '1rem', md: '1.05rem' },
                      fontWeight: 700,
                      borderRadius: 2.5,
                      textTransform: 'none',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.95)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => handleOpenDialog('login')}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.8)',
                      color: 'white',
                      px: { xs: 4, md: 5 },
                      py: { xs: 1.8, md: 1.75 },
                      fontSize: { xs: '1rem', md: '1.05rem' },
                      fontWeight: 700,
                      borderRadius: 2.5,
                      borderWidth: 2,
                      textTransform: 'none',
                      backdropFilter: 'blur(10px)',
                      bgcolor: 'rgba(255,255,255,0.08)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: 'white',
                        borderWidth: 2,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* User Type Selection Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            Select Your Role
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
            Choose the account type that applies to you
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Card 
                elevation={2}
                sx={{ 
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardActionArea onClick={() => handleUserTypeSelect('Student')}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      Student
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Access your courses, grades, and assignments
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card 
                elevation={2}
                sx={{ 
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardActionArea onClick={() => handleUserTypeSelect('Teacher')}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <PersonIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      Teacher
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage classes, students, and track progress
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card 
                elevation={2}
                sx={{ 
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardActionArea onClick={() => handleUserTypeSelect('Admin')}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <AdminPanelSettingsIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      Admin
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Full system access and school management
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LandingPage;