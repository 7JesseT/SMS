import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import Grid from "@mui/material/Grid";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
  People as GuardianIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useStudentDetails, useUpdateStudentProfile } from '../../services/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileEditPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: student, isLoading } = useStudentDetails(user?.id);
  const updateProfile = useUpdateStudentProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    rollNum: '',
    dateOfBirth: '',
    address: '',
    guardianName: '',
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [error, setError] = useState('');

  // Initialize form data when student data loads
  React.useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        rollNum: student.rollNum?.toString() || '',
        dateOfBirth: student.dateOfBirth 
          ? new Date(student.dateOfBirth).toISOString().split('T')[0] 
          : '',
        address: student.address || '',
        guardianName: student.guardianName || '',
      });
      if (student.photo) {
        setPhotoPreview(student.photo);
      }
    }
  }, [student]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setError('');
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setPhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!user?.id) {
      setError('User ID not found');
      return;
    }

    const updateData: any = {
      name: formData.name.trim(),
      rollNum: formData.rollNum,
    };

    if (formData.dateOfBirth) updateData.dateOfBirth = formData.dateOfBirth;
    if (formData.address) updateData.address = formData.address;
    if (formData.guardianName) updateData.guardianName = formData.guardianName;
    if (photoFile) updateData.photo = photoFile;

    updateProfile.mutate(
      { studentId: user.id, data: updateData },
      {
        onSuccess: () => {
          navigate('/student/profile');
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || 'Failed to update profile');
        },
      }
    );
  };

  const handleCancel = () => {
    navigate('/student/profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body1" color="text.secondary">
            Loading profile...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Failed to load student details
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Header Section with Gradient Background */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          pt: 3,
          pb: 8,
          mb: -4,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={isSmallScreen ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isSmallScreen ? 'stretch' : 'center'}
            spacing={2}
            mb={3}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Back to Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'rgba(244,67,54,0.8)',
                  bgcolor: 'rgba(244,67,54,0.1)',
                },
              }}
            >
              Logout
            </Button>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
          >
            <EditIcon sx={{ color: 'white', fontSize: isMobile ? 28 : 32 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              Edit Profile
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Main Edit Card */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Photo Upload Section */}
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              mb={4}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.default',
              }}
            >
              <Box position="relative" mb={2}>
                <Avatar
                  src={photoPreview || undefined}
                  sx={{
                    width: { xs: 140, sm: 160 },
                    height: { xs: 140, sm: 160 },
                    bgcolor: 'primary.main',
                    fontSize: '3.5rem',
                    border: '4px solid',
                    borderColor: 'background.paper',
                    boxShadow: theme.shadows[8],
                  }}
                >
                  {!photoPreview && formData.name.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    bgcolor: 'warning.main',
                    color: 'white',
                    boxShadow: theme.shadows[4],
                    '&:hover': {
                      bgcolor: 'warning.dark',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <PhotoCameraIcon />
                </IconButton>
              </Box>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoSelect}
              />
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Click camera icon to upload photo
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Supported formats: JPG, PNG (Max 5MB)
                </Typography>
              </Stack>
            </Box>

            <Divider sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                PERSONAL INFORMATION
              </Typography>
            </Divider>

            {/* Form Fields */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange('name')}
                  disabled={updateProfile.isPending}
                  required
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Roll Number"
                  value={formData.rollNum}
                  disabled
                  InputProps={{
                    startAdornment: <BadgeIcon sx={{ mr: 1, color: 'action.disabled' }} />,
                    readOnly: true,
                  }}
                  helperText="This field cannot be edited"
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange('dateOfBirth')}
                  disabled={updateProfile.isPending}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={handleChange('address')}
                  disabled={updateProfile.isPending}
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <HomeIcon sx={{ mr: 1, mt: 1, color: 'action.active', alignSelf: 'flex-start' }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Guardian Name"
                  value={formData.guardianName}
                  onChange={handleChange('guardianName')}
                  disabled={updateProfile.isPending}
                  InputProps={{
                    startAdornment: <GuardianIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Action Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={updateProfile.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSave}
                disabled={updateProfile.isPending || !formData.name.trim()}
                fullWidth
                sx={{
                  py: 1.8,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {updateProfile.isPending ? 'Saving Changes...' : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={updateProfile.isPending}
                fullWidth
                sx={{
                  py: 1.8,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Cancel
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfileEditPage;
