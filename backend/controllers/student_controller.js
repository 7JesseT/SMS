const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const { generateToken, getCookieOptions } = require('../middleware/auth.js');
const { upload } = require('../config/cloudinary.js');

const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            return res.status(400).json({ message: 'Roll Number already exists' });
        }
        else {
            const student = new Student({
                ...req.body,
                school: req.body.adminID,
                password: hashedPass
            });

            let result = await student.save();

            result.password = undefined;
            res.status(201).json(result);
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const studentLogIn = async (req, res) => {
    try {
        if (!req.body.rollNum || !req.body.studentName || !req.body.password) {
            return res.status(400).json({ message: 'Roll number, name, and password are required' });
        }

        let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validated = await bcrypt.compare(req.body.password, student.password);
        if (!validated) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Store school ID before populating (since populate changes the structure)
        const schoolId = student.school;

        student = await student.populate("school", "schoolName");
        student = await student.populate("sclassName", "sclassName");

        // Generate JWT token using the original school ID
        const token = generateToken({ _id: student._id, role: 'Student', school: schoolId });

        // Set httpOnly cookie
        res.cookie('token', token, getCookieOptions());

        student.password = undefined;
        student.examResult = undefined;
        student.attendance = undefined;
        res.json({ user: student, role: 'Student' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (student) {
            student.password = undefined;
            res.send(student);
        }
        else {
            res.send({ message: "No student found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const subject = await Subject.findById(subName);

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            student.attendance.push({ date, status, subName });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Update student profile with personal information
const updateStudentProfile = async (req, res) => {
    try {
        const { name, dateOfBirth, address, guardianName } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
        if (address) updateData.address = address;
        if (guardianName) updateData.guardianName = guardianName;

        // If photo is uploaded via Cloudinary
        if (req.file) {
            updateData.photo = req.file.path;
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).populate("school", "schoolName")
         .populate("sclassName", "sclassName");

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.password = undefined;
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Bulk update exam results
const bulkUpdateExamResults = async (req, res) => {
    const { students, examName, subName, date, totalMarks } = req.body;

    try {
        // students is an array of { studentId, marksObtained }
        const updates = students.map(async (studentData) => {
            const student = await Student.findById(studentData.studentId);
            
            if (!student) {
                return { studentId: studentData.studentId, success: false, message: 'Student not found' };
            }

            const existingResultIndex = student.examResult.findIndex(
                (result) => result.subName.toString() === subName && result.examName === examName
            );

            if (existingResultIndex !== -1) {
                student.examResult[existingResultIndex].marksObtained = studentData.marksObtained;
                student.examResult[existingResultIndex].totalMarks = totalMarks;
                student.examResult[existingResultIndex].date = date;
            } else {
                student.examResult.push({ 
                    subName, 
                    marksObtained: studentData.marksObtained,
                    totalMarks,
                    examName,
                    date
                });
            }

            await student.save();
            return { studentId: studentData.studentId, success: true };
        });

        const results = await Promise.all(updates);
        res.json({ message: 'Exam results updated', results });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudent,
    updateStudent,
    studentAttendance,
    updateExamResult,
    updateStudentProfile,
    bulkUpdateExamResults,

    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};