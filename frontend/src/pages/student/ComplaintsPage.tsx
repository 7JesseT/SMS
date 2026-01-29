import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  CheckCircle as ResolvedIcon,
  HourglassEmpty as PendingIcon,
  Report as ComplaintIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { mockComplaints } from '../../data/mockComplaints';
import { mockCurrentStudent } from '../../data/mockCurrentStudent';

const ComplaintsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    complaint: '',
  });

  const student = mockCurrentStudent;

  // Filter complaints for current student
  const myComplaints = mockComplaints.filter(c => c.user.rollNum === student.rollNum);

  // Filter by search query
  const filteredComplaints = myComplaints.filter(
    complaint =>
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.complaint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by date (most recent first)
  const sortedComplaints = [...filteredComplaints].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalComplaints = myComplaints.length;
  const pendingComplaints = myComplaints.filter(c => c.status === 'Pending').length;
  const resolvedComplaints = myComplaints.filter(c => c.status === 'Resolved').length;

  const handleSubmitComplaint = () => {
    // In real implementation, this would call the API
    console.log('Submitting complaint:', newComplaint);
    setNewComplaint({ title: '', complaint: '' });
    setOpenDialog(false);
    // Show success notification
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          My Complaints
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Submit Complaint
        </Button>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <ComplaintIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalComplaints}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Complaints
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <PendingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {pendingComplaints}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <ResolvedIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {resolvedComplaints}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resolved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search complaints by title or description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Complaints Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Complaint History
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedComplaints.map((complaint) => (
                <TableRow key={complaint._id}>
                  <TableCell>
                    {new Date(complaint.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">{complaint.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {complaint.complaint}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={complaint.status}
                      color={complaint.status === 'Resolved' ? 'success' : 'warning'}
                      size="small"
                      icon={
                        complaint.status === 'Resolved' ? <ResolvedIcon /> : <PendingIcon />
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
              {sortedComplaints.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <ComplaintIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">
                      {searchQuery
                        ? 'No complaints found matching your search'
                        : "You haven't submitted any complaints yet"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Submit Complaint Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Submit New Complaint
            </Typography>
            <IconButton onClick={() => setOpenDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mt={1}>
            <TextField
              fullWidth
              label="Title"
              placeholder="Brief title of your complaint"
              value={newComplaint.title}
              onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              placeholder="Please describe your complaint in detail..."
              value={newComplaint.complaint}
              onChange={(e) => setNewComplaint({ ...newComplaint, complaint: e.target.value })}
              multiline
              rows={6}
              required
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Please provide detailed information to help us address your concern effectively.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitComplaint}
            disabled={!newComplaint.title.trim() || !newComplaint.complaint.trim()}
          >
            Submit Complaint
          </Button>
        </DialogActions>
      </Dialog>

      {/* Info Card */}
      {totalComplaints === 0 && (
        <Card sx={{ mt: 3, bgcolor: 'info.lighter' }}>
          <CardContent>
            <Box display="flex" alignItems="start" gap={2}>
              <ComplaintIcon color="info" />
              <Box>
                <Typography variant="h6" fontWeight="bold" color="info.dark" gutterBottom>
                  How to Submit a Complaint
                </Typography>
                <Typography variant="body2" color="info.dark" paragraph>
                  If you're facing any issues or have concerns, you can submit a complaint by
                  clicking the "Submit Complaint" button above.
                </Typography>
                <Typography variant="body2" color="info.dark">
                  Please provide:
                </Typography>
                <ul style={{ margin: '8px 0', paddingLeft: '24px' }}>
                  <li>
                    <Typography variant="body2" color="info.dark">
                      A clear and concise title
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="info.dark">
                      Detailed description of the issue
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="info.dark">
                      Any relevant details that can help us resolve the issue quickly
                    </Typography>
                  </li>
                </ul>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ComplaintsPage;
