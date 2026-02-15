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
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Save } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { api, studentApi } from '../../services/api';
import type { Student } from '../../types/student.types';
import type { Subject } from '../../types/entities.types';

interface MarkEntry {
  studentId: string;
  studentName: string;
  rollNum: string;
  marksObtained: number;
}

export const MarksInputPage: React.FC = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examName, setExamName] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [markEntries, setMarkEntries] = useState<MarkEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, [user]);

  const fetchSubjects = async () => {
    if (!user?.school) return;

    try {
      const response = await api.get(`/AllSubjects/${user.school}`);
      // Filter subjects taught by this teacher
      const teacherSubjects = response.data.filter(
        (subject: Subject) => subject.teacher?._id === user._id
      );
      setSubjects(teacherSubjects);
    } catch (err: any) {
      setError('Failed to load subjects');
    }
  };

  const fetchStudents = async (subjectId: string) => {
    try {
      const subject = subjects.find((s) => s._id === subjectId);
      if (!subject) return;

      const response = await api.get(`/Sclass/Students/${subject.sclassName._id}`);
      const studentsList = response.data;
      setStudents(studentsList);

      // Initialize mark entries
      setMarkEntries(
        studentsList.map((student: Student) => ({
          studentId: student._id,
          studentName: student.name,
          rollNum: student.rollNum,
          marksObtained: 0,
        }))
      );
    } catch (err: any) {
      setError('Failed to load students');
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    fetchStudents(subjectId);
  };

  const handleMarkChange = (studentId: string, marks: number) => {
    setMarkEntries((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId ? { ...entry, marksObtained: marks } : entry
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedSubject || !examName) {
      setError('Please select subject and enter exam name');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        students: markEntries.map((entry) => ({
          studentId: entry.studentId,
          marksObtained: entry.marksObtained,
        })),
        examName,
        subName: selectedSubject,
        date: examDate,
        totalMarks,
      };

      await studentApi.bulkUpdateExamResults(payload);
      setSuccess('Marks updated successfully!');
      // Reset form
      setExamName('');
      setMarkEntries((prev) => prev.map((entry) => ({ ...entry, marksObtained: 0 })));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Input Student Marks
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth required>
              <InputLabel>Subject</InputLabel>
              <Select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                label="Subject"
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject._id} value={subject._id}>
                    {subject.subName} ({subject.sclassName.sclassName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Exam Name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="e.g., Midterm, Final"
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Total Marks"
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
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

      {selectedSubject && students.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Roll No.</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Marks Obtained</TableCell>
                  <TableCell>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {markEntries.map((entry) => (
                  <TableRow key={entry.studentId}>
                    <TableCell>{entry.rollNum}</TableCell>
                    <TableCell>{entry.studentName}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={entry.marksObtained}
                        onChange={(e) =>
                          handleMarkChange(entry.studentId, Number(e.target.value))
                        }
                        inputProps={{ min: 0, max: totalMarks }}
                        sx={{ width: 100 }}
                      />
                    </TableCell>
                    <TableCell>
                      {((entry.marksObtained / totalMarks) * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Marks'}
            </Button>
          </Box>
        </>
      )}

      {selectedSubject && students.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No students found in this class</Typography>
        </Paper>
      )}
    </Box>
  );
};
