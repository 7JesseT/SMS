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
  Divider,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { mockCurrentStudent } from '../../data/mockCurrentStudent';

const GradesPage: React.FC = () => {
  const student = mockCurrentStudent;
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Get unique subjects from exam results
  const subjects = Array.from(
    new Set(student.examResult?.map(e => e.subName.subName) || [])
  );

  // Filter exam results
  const filteredResults = student.examResult?.filter(exam => {
    if (filterSubject === 'all') return true;
    return exam.subName.subName === filterSubject;
  }) || [];

  // Calculate overall statistics
  const totalMarks = student.examResult?.reduce((sum, exam) => sum + exam.marksObtained, 0) || 0;
  const totalPossible = student.examResult?.reduce((sum, exam) => sum + exam.totalMarks, 0) || 0;
  const averagePercentage = totalPossible > 0 ? (totalMarks / totalPossible) * 100 : 0;

  // Calculate subject-wise averages
  const subjectAverages = subjects.map(subject => {
    const subjectExams = student.examResult?.filter(e => e.subName.subName === subject) || [];
    const subTotal = subjectExams.reduce((sum, exam) => sum + exam.marksObtained, 0);
    const subPossible = subjectExams.reduce((sum, exam) => sum + exam.totalMarks, 0);
    const percentage = subPossible > 0 ? (subTotal / subPossible) * 100 : 0;
    
    // Determine grade
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    return {
      subject,
      exams: subjectExams.length,
      totalMarks: subTotal,
      totalPossible: subPossible,
      percentage,
      grade,
    };
  });

  // Get grade color
  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'primary';
    if (percentage >= 70) return 'info';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  // Sort results by date (most recent first)
  const sortedResults = [...filteredResults].sort(
    (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
  );

  const totalExams = student.examResult?.length || 0;
  const highestScore = Math.max(...(student.examResult?.map(e => e.percentage || 0) || [0]));
  const lowestScore = Math.min(...(student.examResult?.map(e => e.percentage || 0) || [100]));

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Grades
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Average Grade
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {averagePercentage.toFixed(1)}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <TrophyIcon />
                </Avatar>
              </Box>
              <LinearProgress
                variant="determinate"
                value={averagePercentage}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                color={getGradeColor(averagePercentage) as any}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Exams
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {totalExams}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <SchoolIcon />
                </Avatar>
              </Box>
              <Typography variant="body2" color="text.secondary" mt={2}>
                Across {subjects.length} subjects
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Highest Score
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="success.main">
                    {highestScore.toFixed(0)}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ color: 'success.dark' }} />
                </Avatar>
              </Box>
              <Typography variant="body2" color="text.secondary" mt={2}>
                Personal best
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Lowest Score
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="warning.main">
                    {lowestScore.toFixed(0)}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
                  <TrophyIcon sx={{ color: 'warning.dark' }} />
                </Avatar>
              </Box>
              <Typography variant="body2" color="text.secondary" mt={2}>
                Room for improvement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Subject-wise Performance */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Subject-wise Performance
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell align="center">Total Exams</TableCell>
                <TableCell align="center">Marks Obtained</TableCell>
                <TableCell align="center">Total Marks</TableCell>
                <TableCell align="center">Percentage</TableCell>
                <TableCell align="center">Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjectAverages.map((subject, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography fontWeight="medium">{subject.subject}</Typography>
                  </TableCell>
                  <TableCell align="center">{subject.exams}</TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="medium">{subject.totalMarks}</Typography>
                  </TableCell>
                  <TableCell align="center">{subject.totalPossible}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                      <Typography fontWeight="medium">{subject.percentage.toFixed(1)}%</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={subject.percentage}
                        sx={{ width: 60, height: 6, borderRadius: 3 }}
                        color={getGradeColor(subject.percentage) as any}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={subject.grade}
                      color={getGradeColor(subject.percentage) as any}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Exam Results */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Exam Results
          </Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Subject</InputLabel>
            <Select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              label="Filter by Subject"
            >
              <MenuItem value="all">All Subjects</MenuItem>
              {subjects.map(subject => (
                <MenuItem key={subject} value={subject}>{subject}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Exam Name</TableCell>
                <TableCell align="center">Marks Obtained</TableCell>
                <TableCell align="center">Total Marks</TableCell>
                <TableCell align="center">Percentage</TableCell>
                <TableCell align="center">Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedResults.map((exam, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(exam.date!).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography fontWeight="medium">{exam.subName.subName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {exam.subName.subCode}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{exam.examName}</TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="medium" color="primary">
                      {exam.marksObtained}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{exam.totalMarks}</TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="medium">
                      {exam.percentage?.toFixed(1)}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={exam.grade}
                      color={getGradeColor(exam.percentage || 0) as any}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default GradesPage;
