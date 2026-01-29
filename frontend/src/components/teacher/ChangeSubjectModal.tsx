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
import { teacherApi } from '../../services/teacherApi';

interface ChangeSubjectModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangeSubjectModal: React.FC<ChangeSubjectModalProps> = ({ open, onClose }) => {
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get user from localStorage
  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');

  const handleSubmit = async () => {
    if (!subject.trim()) {
      setError('Please enter a subject name');
      return;
    }

    if (!authUser?.id) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await teacherApi.updateSubject({
        teacherId: authUser.id,
        teachSubject: subject.trim(),
      });

      setSuccess(true);
      setSubject('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Subject update error:', err);
      setError(err.response?.data?.message || 'Failed to update subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSubject('');
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Change Subject
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Enter the name of the subject you want to teach
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Subject updated successfully!
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Subject Name"
            placeholder="e.g., Mathematics, English, Science"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setError('');
            }}
            disabled={loading || success}
            multiline
            rows={1}
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || success || !subject.trim()}
          variant="contained"
          color="success"
        >
          {loading ? <CircularProgress size={24} /> : 'Update Subject'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeSubjectModal;
