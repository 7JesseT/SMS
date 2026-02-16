import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useCreateComplaint } from '../../services/studentApi';

interface ComplaintModalProps {
  open: boolean;
  onClose: () => void;
}

const ComplaintModal: React.FC<ComplaintModalProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const [complaint, setComplaint] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const createComplaintMutation = useCreateComplaint();

  // Get schoolId from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const schoolId = typeof currentUser.school === 'string' 
    ? currentUser.school 
    : currentUser.school?._id;

  const handleSubmit = async () => {
    if (!complaint.trim()) {
      setError('Please enter your complaint');
      return;
    }

    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    if (!schoolId) {
      setError('School information not found');
      return;
    }

    setError('');

    try {
      await createComplaintMutation.mutateAsync({
        user: user.id,
        date: new Date().toISOString().split('T')[0],
        complaint: complaint.trim(),
        school: schoolId,
      });

      setSuccess(true);
      setComplaint('');
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Complaint submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    }
  };

  const handleClose = () => {
    if (!createComplaintMutation.isPending) {
      setComplaint('');
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Submit a Complaint
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Please describe your issue or concern in detail
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Complaint submitted successfully! An administrator will review it soon.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={6}
            label="Your Complaint"
            placeholder="Describe your complaint or issue in detail..."
            value={complaint}
            onChange={(e) => {
              setComplaint(e.target.value);
              setError('');
            }}
            disabled={createComplaintMutation.isPending || success}
            required
            helperText={`${complaint.length} characters`}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button 
          onClick={handleClose} 
          disabled={createComplaintMutation.isPending || success}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={createComplaintMutation.isPending || success || !complaint.trim()}
        >
          {createComplaintMutation.isPending ? <CircularProgress size={24} /> : 'Submit Complaint'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComplaintModal;
