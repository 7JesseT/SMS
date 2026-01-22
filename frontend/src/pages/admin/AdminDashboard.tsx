import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  People,
  School,
  Class,
  MenuBook,
  TrendingUp,
  PersonAdd,
} from '@mui/icons-material';
import { StatsCard } from '../../components/common';
import { mockStudents } from '../../data/mockStudents';
import { mockTeachers } from '../../data/mockTeachers';
import { mockClasses } from '../../data/mockClasses';
import { mockSubjects } from '../../data/mockSubjects';
import { mockComplaints } from '../../data/mockComplaints';
import { mockNotices } from '../../data/mockNotices';

const AdminDashboard: React.FC = () => {
  // Calculate statistics
  const totalStudents = mockStudents.length;
  const totalTeachers = mockTeachers.length;
  const totalClasses = mockClasses.length;
  const totalSubjects = mockSubjects.length;
  const activeComplaints = mockComplaints.filter(c => c.status === 'Pending').length;
  const recentNotices = mockNotices.filter(n => {
    const noticeDate = new Date(n.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return noticeDate > weekAgo;
  }).length;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your school management system
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Students"
            value={totalStudents}
            icon={<People />}
            color="primary"
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Teachers"
            value={totalTeachers}
            icon={<School />}
            color="success"
            trend={{ value: 5, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Classes"
            value={totalClasses}
            icon={<Class />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Subjects"
            value={totalSubjects}
            icon={<MenuBook />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Active Complaints"
            value={activeComplaints}
            icon={<TrendingUp />}
            color="error"
            subtitle="Pending resolution"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Recent Notices"
            value={recentNotices}
            icon={<PersonAdd />}
            color="secondary"
            subtitle="Posted this week"
          />
        </Grid>

        {/* Recent Activity Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Notices
            </Typography>
            {mockNotices.slice(0, 5).map((notice) => (
              <Box
                key={notice._id}
                sx={{
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {notice.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notice.date).toLocaleDateString()} • {notice.details.substring(0, 50)}...
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Pending Complaints
            </Typography>
            {mockComplaints
              .filter(c => c.status === 'Pending')
              .slice(0, 5)
              .map((complaint) => (
                <Box
                  key={complaint._id}
                  sx={{
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {complaint.complaint}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(complaint.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
