const Notice = require('../models/noticeSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Admin = require('../models/adminSchema.js');

const noticeCreate = async (req, res) => {
    try {
        const notice = new Notice({
            ...req.body,
            school: req.body.adminID
        })
        const result = await notice.save()
        res.send(result)
    } catch (err) {
        res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        let schoolId = req.params.id;
        let userRole = null;

        // Try to find if the ID belongs to a student
        const student = await Student.findById(req.params.id);
        if (student) {
            schoolId = student.school;
            userRole = 'Student';
        } else {
            // Try to find if the ID belongs to a teacher
            const teacher = await Teacher.findById(req.params.id);
            if (teacher) {
                schoolId = teacher.school;
                userRole = 'Teacher';
            } else {
                // Try to find if the ID belongs to an admin
                const admin = await Admin.findById(req.params.id);
                if (admin) {
                    schoolId = admin._id;
                    userRole = 'Admin';
                }
            }
        }

        // Fetch notices based on school and target
        let notices;
        if (userRole) {
            // Get notices that target "All" or the specific user role
            notices = await Notice.find({ 
                school: schoolId,
                target: { $in: ['All', userRole] }
            }).sort({ date: -1 });
        } else {
            // If no user found, just search by school ID (backward compatibility)
            notices = await Notice.find({ school: schoolId }).sort({ date: -1 });
        }

        if (notices.length > 0) {
            res.send(notices)
        } else {
            res.send({ message: "No notices found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteNotices = async (req, res) => {
    try {
        const result = await Notice.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No notices found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };