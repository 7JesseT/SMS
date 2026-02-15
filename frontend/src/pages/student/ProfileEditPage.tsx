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
  Grid,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useStudentDetails, useUpdateStudentProfile } from '../../services/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileEditPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: student, isLoading } = useStudentDetails(user?.id);
  const updateProfile = useUpdateStudentProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
        email: '',
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

    if (formData.email) updateData.email = formData.email;
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
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error">Failed to load student details</Alert>
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
            onClick={handleCancel}
          >
            Back
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
          Edit Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 4 }}>
            {/* Photo Upload */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
              <Box position="relative">
                <Avatar
                  src={photoPreview || undefined}
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                  }}
                >
                  {!photoPreview && formData.name.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
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
              <Typography variant="caption" color="text.secondary" mt={1}>
                Click camera icon to upload photo (Max 5MB)
              </Typography>
            </Box>

            {/* Form Fields */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  value={formData.name}
                  onChange={handleChange('name')}
                  disabled={updateProfile.isPending}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Roll Number"
                  value={formData.rollNum}
                  onChange={handleChange('rollNum')}
                  disabled={updateProfile.isPending}
                  helperText="Read-only field"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  disabled={updateProfile.isPending}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
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
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={handleChange('address')}
                  disabled={updateProfile.isPending}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Guardian Name"
                  value={formData.guardianName}
                  onChange={handleChange('guardianName')}
                  disabled={updateProfile.isPending}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box display="flex" gap={2} mt={4}>
              <Button
                variant="contained"
                color="primary"
                startIcon={updateProfile.isPending ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSave}
                disabled={updateProfile.isPending || !formData.name.trim()}
                fullWidth
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={updateProfile.isPending}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfileEditPage;
