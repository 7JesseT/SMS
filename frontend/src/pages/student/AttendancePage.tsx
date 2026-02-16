import React, { useState } from 'react';
import {
  Box,
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
  Container,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  EventNote as AttendanceIcon,
} from '@mui/icons-material';
import { mockCurrentStudent } from '../../data/mockCurrentStudent';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const student = mockCurrentStudent;
  const [filterMonth, setFilterMonth] = useState<string>('all');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

  // Stat Card Component
  const StatCard = ({ icon, label, value, subtext, color = 'primary' }: any) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: `${color}.main`,
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={700} color={`${color}.main`}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
      {subtext && (
        <Typography variant="body2" color="text.secondary">
          {subtext}
        </Typography>
      )}
    </Paper>
  );

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
              onClick={() => navigate('/student/dashboard')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Dashboard
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

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <AttendanceIcon sx={{ color: 'white', fontSize: isMobile ? 28 : 32 }} />
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
              My Attendance
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">

        {/* Overview Cards */}
        <Grid container spacing={2.5} mb={4}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<CalendarIcon sx={{ fontSize: 32 }} />}
              label="Overall Attendance"
              value={`${attendancePercentage.toFixed(1)}%`}
              subtext={
                <LinearProgress
                  variant="determinate"
                  value={attendancePercentage}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  color={attendancePercentage >= 75 ? 'success' : 'warning'}
                />
              }
              color={attendancePercentage >= 75 ? 'success' : 'warning'}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<PresentIcon sx={{ fontSize: 32 }} />}
              label="Classes Present"
              value={presentClasses}
              subtext={`Out of ${totalClasses} total classes`}
              color="success"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<AbsentIcon sx={{ fontSize: 32 }} />}
              label="Classes Absent"
              value={absentClasses}
              subtext={`${((absentClasses / totalClasses) * 100 || 0).toFixed(1)}% of total`}
              color="error"
            />
          </Grid>
        </Grid>

        {/* Subject-wise Attendance */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Subject-wise Attendance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Subject</strong></TableCell>
                  <TableCell align="center"><strong>Total Classes</strong></TableCell>
                  <TableCell align="center"><strong>Present</strong></TableCell>
                  <TableCell align="center"><strong>Absent</strong></TableCell>
                  <TableCell align="center"><strong>Percentage</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjectAttendance.map((subject, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{subject.subject}</Typography>
                    </TableCell>
                    <TableCell align="center">{subject.total}</TableCell>
                    <TableCell align="center">
                      <Typography color="success.main" fontWeight={600}>
                        {subject.present}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography color="error.main" fontWeight={600}>
                        {subject.absent}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                        <Typography fontWeight={600}>{subject.percentage.toFixed(1)}%</Typography>
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
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Subject</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAttendance.map((record, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{record.subName?.subName || 'N/A'}</Typography>
                    </TableCell>
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
          <Card 
            sx={{ 
              mt: 3, 
              bgcolor: 'warning.lighter',
              border: '1px solid',
              borderColor: 'warning.main',
            }}
            elevation={0}
          >
            <CardContent>
              <Box display="flex" alignItems="start" gap={2}>
                <AbsentIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="warning.dark" gutterBottom>
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
      </Container>
    </Box>
  );
};

export default AttendancePage;
