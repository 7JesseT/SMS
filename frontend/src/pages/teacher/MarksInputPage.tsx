import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Logout as LogoutIcon,
  Assessment as AssessmentIcon,
  Print as PrintIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  useBulkUpdateExamResults, 
  useTeacherSubjects, 
  useSchoolStudents,
  useClassStudents,
  useAllSubjects
} from '../../services/teacherApi';
import type { Student } from '../../types/student.types';
import type { Subject } from '../../types/entities.types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface MarkEntry {
  studentId: string;
  studentName: string;
  rollNum: string;
  marksObtained: number;
}

export const MarksInputPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const bulkUpdateMutation = useBulkUpdateExamResults();
  
  // Get user and school info
  const { getCurrentUserData } = useAuth() as any;
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');
  const currentUser = getCurrentUserData();
  const schoolId = typeof currentUser?.school === 'string' ? currentUser.school : currentUser?.school?._id;
  const teacherId = authUser.id || authUser._id || currentUser?._id;
  
  // Fetch data using TanStack Query hooks
  const { data: subjects = [], isLoading: subjectsLoading, error: subjectsError } = useTeacherSubjects(schoolId, teacherId);
  const { data: allSubjects = [], isLoading: allSubjectsLoading, error: allSubjectsError } = useAllSubjects(schoolId);
  const { data: allStudents = [], isLoading: studentsLoading, error: studentsError } = useSchoolStudents(schoolId);
  
  // State management
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubjectId, setCustomSubjectId] = useState(''); // For custom mode subject selection
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [useCustomSubject, setUseCustomSubject] = useState(false);
  const [examName, setExamName] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [markEntries, setMarkEntries] = useState<MarkEntry[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Get class ID for selected subject
  const selectedSubjectData = subjects.find((s) => s._id === selectedSubject);
  const classId = selectedSubjectData 
    ? (typeof selectedSubjectData.sclassName === 'string' 
        ? selectedSubjectData.sclassName 
        : selectedSubjectData.sclassName._id)
    : undefined;
  
  // Fetch students for selected class
  const { data: classStudents = [], isLoading: classStudentsLoading } = useClassStudents(classId);
  
  // Update mark entries when class students change
  useEffect(() => {
    if (selectedSubject && classStudents.length > 0 && !useCustomSubject) {
      setMarkEntries(
        classStudents.map((student: Student) => ({
          studentId: student._id,
          studentName: student.name,
          rollNum: student.rollNum,
          marksObtained: 0,
        }))
      );
    }
  }, [classStudents, selectedSubject, useCustomSubject]);
  
  const loading = subjectsLoading || studentsLoading || classStudentsLoading || allSubjectsLoading;

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setUseCustomSubject(false);
    setCustomSubjectName('');
    setError('');
    setSuccess('');
    // Mark entries will be updated automatically via useEffect
  };

  const handleAddStudent = () => {
    if (!selectedStudent) return;
    
    // Check if student is already added
    if (markEntries.some(entry => entry.studentId === selectedStudent._id)) {
      setError('This student has already been added');
      return;
    }

    const newEntry: MarkEntry = {
      studentId: selectedStudent._id,
      studentName: selectedStudent.name,
      rollNum: selectedStudent.rollNum,
      marksObtained: 0,
    };

    setMarkEntries([...markEntries, newEntry]);
    setSelectedStudent(null);
    setError('');
  };

  const handleRemoveStudent = (studentId: string) => {
    setMarkEntries(markEntries.filter(entry => entry.studentId !== studentId));
  };

  const handleCustomSubjectToggle = () => {
    setUseCustomSubject(!useCustomSubject);
    setSelectedSubject('');
    setCustomSubjectId('');
    setCustomSubjectName('');
    setMarkEntries([]);
    setError('');
    setSuccess('');
  };

  const handleMarkChange = (studentId: string, marks: number) => {
    const validMarks = Math.max(0, Math.min(marks, totalMarks));
    setMarkEntries((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId ? { ...entry, marksObtained: validMarks } : entry
      )
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async () => {
    if (useCustomSubject) {
      if (!customSubjectId || !examName) {
        setError('Please select a subject and enter exam name');
        return;
      }
    } else {
      if (!selectedSubject || !examName) {
        setError('Please select subject and enter exam name');
        return;
      }
    }

    if (markEntries.length === 0) {
      setError('Please add at least one student');
      return;
    }

    setError('');
    setSuccess('');

    const payload = {
      students: markEntries.map((entry) => ({
        studentId: entry.studentId,
        marksObtained: entry.marksObtained,
      })),
      examName,
      subName: useCustomSubject ? customSubjectId : selectedSubject,
      date: examDate,
      totalMarks,
    };

    bulkUpdateMutation.mutate(payload, {
      onSuccess: (response) => {
        setSuccess('Marks updated successfully!');
        setExamName('');
        setMarkEntries((prev) => prev.map((entry) => ({ ...entry, marksObtained: 0 })));
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Failed to update marks');
      },
    });
  };

  const handleGenerateReport = () => {
    if (markEntries.length === 0) {
      setError('Please enter marks before generating a report');
      return;
    }

    if (useCustomSubject && !customSubjectId) {
      setError('Please select a subject before generating a report');
      return;
    }

    if (!useCustomSubject && !selectedSubject) {
      setError('Please select a subject before generating a report');
      return;
    }

    try {
      let subjectName: string;
      let className: string;

      if (useCustomSubject) {
        const subject = allSubjects.find(s => s._id === customSubjectId);
        subjectName = subject?.subName || customSubjectName || 'Unknown Subject';
        className = typeof subject?.sclassName === 'string' 
          ? subject.sclassName 
          : subject?.sclassName?.sclassName || 'Custom Entry';
      } else {
        const subject = subjects.find(s => s._id === selectedSubject);
        subjectName = subject?.subName || 'Unknown Subject';
        className = typeof subject?.sclassName === 'string' 
          ? subject.sclassName 
          : subject?.sclassName?.sclassName || 'Unknown Class';
      }

      // Create PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(25, 118, 210); // Primary blue color
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Exam Results Report', pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(examName, pageWidth / 2, 28, { align: 'center' });
      
      // Reset text color for body
      doc.setTextColor(0, 0, 0);
      
      // Exam Details
      let yPos = 50;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Exam Details', 14, yPos);
      
      yPos += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      const details = [
        { label: 'Subject:', value: subjectName },
        { label: 'Class:', value: className },
        { label: 'Date:', value: new Date(examDate).toLocaleDateString() },
        { label: 'Total Marks:', value: totalMarks.toString() },
      ];
      
      details.forEach(detail => {
        doc.setFont('helvetica', 'bold');
        doc.text(detail.label, 14, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(detail.value, 50, yPos);
        yPos += 6;
      });
      
      // Calculate statistics
      const totalStudents = markEntries.length;
      const averageScore = markEntries.reduce((sum, e) => sum + e.marksObtained, 0) / totalStudents;
      const passCount = markEntries.filter(e => (e.marksObtained / totalMarks) * 100 >= 50).length;
      const passRate = (passCount / totalStudents) * 100;
      
      // Student Marks Table
      yPos += 5;
      const tableData = markEntries.map(entry => {
        const percentage = (entry.marksObtained / totalMarks) * 100;
        const grade = percentage >= 90 ? 'A+' :
                     percentage >= 80 ? 'A' :
                     percentage >= 70 ? 'B' :
                     percentage >= 60 ? 'C' :
                     percentage >= 50 ? 'D' : 'F';
        
        return [
          entry.rollNum,
          entry.studentName,
          `${entry.marksObtained} / ${totalMarks}`,
          `${percentage.toFixed(2)}%`,
          grade,
        ];
      });
      
      autoTable(doc, {
        startY: yPos,
        head: [['Roll No.', 'Student Name', 'Marks Obtained', 'Percentage', 'Grade']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [25, 118, 210],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [249, 249, 249],
        },
        margin: { left: 14, right: 14 },
      });
      
      // Statistics section
      const finalY = (doc as any).lastAutoTable.finalY || yPos + 40;
      yPos = finalY + 15;
      
      // Draw statistics boxes
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary Statistics', 14, yPos);
      yPos += 10;
      
      const stats = [
        { label: 'Total Students', value: totalStudents.toString() },
        { label: 'Average Score', value: averageScore.toFixed(1) },
        { label: 'Pass Rate', value: `${passRate.toFixed(0)}%` },
      ];
      
      const boxWidth = 55;
      const boxHeight = 20;
      const spacing = 10;
      let xPos = 14;
      
      stats.forEach((stat, index) => {
        // Draw gradient box effect
        doc.setFillColor(102, 126, 234);
        doc.roundedRect(xPos, yPos, boxWidth, boxHeight, 3, 3, 'F');
        
        // Add text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(stat.label, xPos + boxWidth / 2, yPos + 8, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(stat.value, xPos + boxWidth / 2, yPos + 16, { align: 'center' });
        
        xPos += boxWidth + spacing;
      });
      
      // Footer
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const footerY = doc.internal.pageSize.getHeight() - 15;
      doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY, { align: 'center' });
      
      // Save the PDF
      const fileName = `${examName.replace(/\s+/g, '_')}_${subjectName.replace(/\s+/g, '_')}_Report.pdf`;
      doc.save(fileName);
      
      setSuccess('Report generated successfully!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate report. Please try again.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      {/* Header Section with Gradient Background */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
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
              onClick={() => navigate('/teacher/dashboard')}
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

          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <AssessmentIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="white">
                Input Exam Results
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, color: 'white' }}>
                Enter student marks and generate comprehensive reports
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Exam Details Form */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            mb: 3, 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Exam Details
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={useCustomSubject}
                  onChange={handleCustomSubjectToggle}
                  color="primary"
                />
              }
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">Custom Subject</Typography>
                  {useCustomSubject && <Chip label="Manual Entry" size="small" color="primary" />}
                </Stack>
              }
            />
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              {useCustomSubject ? (
                <FormControl fullWidth required>
                  <InputLabel>Select Subject</InputLabel>
                  <Select
                    value={customSubjectId}
                    onChange={(e) => {
                      setCustomSubjectId(e.target.value);
                      const subject = allSubjects.find(s => s._id === e.target.value);
                      setCustomSubjectName(subject?.subName || '');
                    }}
                    label="Select Subject"
                    disabled={allSubjectsLoading || allSubjects.length === 0}
                  >
                    {allSubjectsLoading ? (
                      <MenuItem value="" disabled>
                        Loading subjects...
                      </MenuItem>
                    ) : allSubjects.length === 0 ? (
                      <MenuItem value="" disabled>
                        No subjects available
                      </MenuItem>
                    ) : (
                      allSubjects.map((subject) => (
                        <MenuItem key={subject._id} value={subject._id}>
                          {subject.subName} - {typeof subject.sclassName === 'string' 
                            ? subject.sclassName 
                            : subject.sclassName.sclassName}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              ) : (
                <>
                  <FormControl fullWidth required>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={selectedSubject}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      label="Subject"
                      disabled={subjects.length === 0}
                    >
                      {subjects.length === 0 ? (
                        <MenuItem value="" disabled>
                          No subjects assigned to you
                        </MenuItem>
                      ) : (
                        subjects.map((subject) => (
                          <MenuItem key={subject._id} value={subject._id}>
                            {subject.subName} ({typeof subject.sclassName === 'string' 
                              ? subject.sclassName 
                              : subject.sclassName.sclassName})
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                  {subjects.length === 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      No subjects assigned. Toggle "Custom Subject" to select from all subjects.
                    </Typography>
                  )}
                </>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Exam Name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g., Mid-Term Exam, Final Exam"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Total Marks"
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Exam Date"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Student Selector for Custom Subject */}
        {useCustomSubject && (
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3 },
              mb: 3, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 3, bgcolor: theme.palette.primary.main, color: 'white', mx: -3, mt: -3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Add Students
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Select students from the list to enter their marks
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <FormControl fullWidth>
                <InputLabel>Select Student</InputLabel>
                <Select
                  value={selectedStudent?._id || ''}
                  onChange={(e) => {
                    const student = allStudents.find(s => s._id === e.target.value);
                    setSelectedStudent(student || null);
                  }}
                  label="Select Student"
                  disabled={allStudents.length === 0}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 400,
                      },
                    },
                  }}
                >
                  {allStudents
                    .filter(s => !markEntries.some(e => e.studentId === s._id))
                    .map((student) => (
                      <MenuItem key={student._id} value={student._id}>
                        {student.name} - Roll: {student.rollNum}
                      </MenuItem>
                    ))}
                  {allStudents.filter(s => !markEntries.some(e => e.studentId === s._id)).length === 0 && (
                    <MenuItem value="" disabled>
                      All students added
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddStudent}
                disabled={!selectedStudent}
                sx={{ minWidth: 120, height: 56 }}
              >
                Add
              </Button>
            </Stack>
            
            {markEntries.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {markEntries.length} student{markEntries.length !== 1 ? 's' : ''} added
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {/* Student Marks Table */}
        {((selectedSubject && markEntries.length > 0) || (useCustomSubject && markEntries.length > 0)) && (
          <>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                mb: 3,
              }}
            >
              <Box sx={{ p: 3, bgcolor: theme.palette.info.main, color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">
                  Student Marks ({markEntries.length} students)
                </Typography>
              </Box>
              
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                        Roll No.
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                        Student Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                        Marks Obtained
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                        Percentage
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                        Grade
                      </TableCell>
                      {useCustomSubject && (
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                          Action
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {markEntries.map((entry) => {
                      const percentage = (entry.marksObtained / totalMarks) * 100;
                      const grade = percentage >= 90 ? 'A+' :
                                   percentage >= 80 ? 'A' :
                                   percentage >= 70 ? 'B' :
                                   percentage >= 60 ? 'C' :
                                   percentage >= 50 ? 'D' : 'F';
                      
                      return (
                        <TableRow 
                          key={entry.studentId}
                          sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                        >
                          <TableCell>{entry.rollNum}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {entry.studentName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={entry.marksObtained}
                              onChange={(e) =>
                                handleMarkChange(entry.studentId, Number(e.target.value))
                              }
                              inputProps={{ 
                                min: 0, 
                                max: totalMarks,
                                step: 0.5,
                              }}
                              size="small"
                              sx={{ width: 120 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              color={percentage >= 50 ? 'success.main' : 'error.main'}
                              fontWeight={500}
                            >
                              {percentage.toFixed(2)}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2"
                              sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                display: 'inline-block',
                                bgcolor: percentage >= 50 ? 'success.lighter' : 'error.lighter',
                                color: percentage >= 50 ? 'success.dark' : 'error.dark',
                                fontWeight: 600,
                              }}
                            >
                              {grade}
                            </Typography>
                          </TableCell>
                          {useCustomSubject && (
                            <TableCell>
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleRemoveStudent(entry.studentId)}
                                title="Remove student"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Action Buttons */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack 
                direction={isMobile ? 'column' : 'row'} 
                spacing={2}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<PrintIcon />}
                  onClick={handleGenerateReport}
                  disabled={!examName || markEntries.length === 0}
                  sx={{ 
                    minWidth: 180,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Generate Report
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={bulkUpdateMutation.isPending ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSubmit}
                  disabled={bulkUpdateMutation.isPending}
                  sx={{ 
                    minWidth: 180,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {bulkUpdateMutation.isPending ? 'Saving...' : 'Save Marks'}
                </Button>
              </Stack>
            </Paper>
          </>
        )}

        {selectedSubject && markEntries.length === 0 && !loading && !classStudentsLoading && (
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              textAlign: 'center',
              borderRadius: 3,
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <AssessmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Students Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no students enrolled in this class
            </Typography>
          </Paper>
        )}

        {!selectedSubject && !useCustomSubject && (
          <Paper 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <AssessmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Select a Subject
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a subject from the dropdown above to begin entering marks
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};
