import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { mockCurrentStudent } from '../../data/mockCurrentStudent';

const AttendancePage: React.FC = () => {
  const student = mockCurrentStudent;
  const [filterMonth, setFilterMonth] = useState<string>('all');

  // Get unique subjects from attendance
  const subjects = Array.from(
    new Set(student.attendance?.map(a => a.subName?.subName) || [])
  ).filter(Boolean);

  // Filter attendance by month
  const filteredAttendance = student.attendance?.filter(record => {
    if (filterMonth === 'all') return true;
    const recordDate = new Date(record.date);
    const month = recordDate.getMonth();
    return month === parseInt(filterMonth);
  }) || [];

  // Calculate overall statistics
  const totalClasses = student.attendance?.length || 0;
  const presentClasses = student.attendance?.filter(a => a.status === 'Present').length || 0;
  const absentClasses = totalClasses - presentClasses;
  const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

  // Calculate subject-wise attendance
  const subjectAttendance = subjects.map(subject => {
    const subjectRecords = student.attendance?.filter(a => a.subName?.subName === subject) || [];
    const total = subjectRecords.length;
    const present = subjectRecords.filter(a => a.status === 'Present').length;
    const percentage = total > 0 ? (present / total) * 100 : 0;

    return {
      subject,
      total,
      present,
      absent: total - present,
      percentage,
    };
  });

  // Sort attendance by date (most recent first)
  const sortedAttendance = [...filteredAttendance].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Attendance
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Overall Attendance
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {attendancePercentage.toFixed(1)}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <CalendarIcon />
                </Avatar>
              </Box>
              <LinearProgress
                variant="determinate"
                value={attendancePercentage}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                color={attendancePercentage >= 75 ? 'success' : 'warning'}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Classes Present
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="success.main">
                    {presentClasses}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                  <PresentIcon sx={{ color: 'success.dark' }} />
                </Avatar>
              </Box>
              <Typography variant="body2" color="text.secondary" mt={2}>
                Out of {totalClasses} total classes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Classes Absent
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="error.main">
                    {absentClasses}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', width: 56, height: 56 }}>
                  <AbsentIcon sx={{ color: 'error.dark' }} />
                </Avatar>
              </Box>
              <Typography variant="body2" color="text.secondary" mt={2}>
                {((absentClasses / totalClasses) * 100).toFixed(1)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Subject-wise Attendance */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Subject-wise Attendance
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell align="center">Total Classes</TableCell>
                <TableCell align="center">Present</TableCell>
                <TableCell align="center">Absent</TableCell>
                <TableCell align="center">Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjectAttendance.map((subject, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography fontWeight="medium">{subject.subject}</Typography>
                  </TableCell>
                  <TableCell align="center">{subject.total}</TableCell>
                  <TableCell align="center">
                    <Typography color="success.main" fontWeight="medium">
                      {subject.present}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="error.main" fontWeight="medium">
                      {subject.absent}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                      <Typography fontWeight="medium">{subject.percentage.toFixed(1)}%</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={subject.percentage}
                        sx={{ width: 60, height: 6, borderRadius: 3 }}
                        color={subject.percentage >= 75 ? 'success' : 'warning'}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Attendance Records */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Attendance Records
          </Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Month</InputLabel>
            <Select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              label="Filter by Month"
            >
              <MenuItem value="all">All Months</MenuItem>
              <MenuItem value="0">January</MenuItem>
              <MenuItem value="1">February</MenuItem>
              <MenuItem value="2">March</MenuItem>
              <MenuItem value="3">April</MenuItem>
              <MenuItem value="4">May</MenuItem>
              <MenuItem value="5">June</MenuItem>
              <MenuItem value="6">July</MenuItem>
              <MenuItem value="7">August</MenuItem>
              <MenuItem value="8">September</MenuItem>
              <MenuItem value="9">October</MenuItem>
              <MenuItem value="10">November</MenuItem>
              <MenuItem value="11">December</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAttendance.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(record.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{record.subName?.subName || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={record.status}
                      color={record.status === 'Present' ? 'success' : 'error'}
                      size="small"
                      icon={record.status === 'Present' ? <PresentIcon /> : <AbsentIcon />}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Warning Message */}
      {attendancePercentage < 75 && (
        <Card sx={{ mt: 3, bgcolor: 'warning.light' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <AbsentIcon sx={{ color: 'warning.dark' }} />
              <Box>
                <Typography variant="h6" fontWeight="bold" color="warning.dark">
                  Attendance Warning
                </Typography>
                <Typography variant="body2" color="warning.dark">
                  Your attendance is below the required 75%. Please maintain regular attendance
                  to be eligible for final examinations.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AttendancePage;
