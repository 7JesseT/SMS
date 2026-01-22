import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'primary.main',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: 'white',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 700,
          }}
        >
          {APP_NAME}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            mb: 4,
            maxWidth: '600px',
            opacity: 0.95,
          }}
        >
          Streamline your school operations with our comprehensive management platform
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            px: 6,
            py: 2,
            fontSize: '1.1rem',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default LandingPage;
