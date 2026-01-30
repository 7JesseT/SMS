const Admin = require('../models/adminSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const { getCookieOptions } = require('../middleware/auth.js');

/**
 * Get current authenticated user details
 * Used for session verification and restoring auth state
 */
const getCurrentUser = async (req, res) => {
    try {
        const { id, role, school } = req.user;
        let user = null;

        switch (role) {
            case 'Admin':
                user = await Admin.findById(id).select('-password');
                break;
            case 'Student':
                user = await Student.findById(id)
                    .select('-password -examResult -attendance')
                    .populate('school', 'schoolName')
                    .populate('sclassName', 'sclassName');
                break;
            case 'Teacher':
                user = await Teacher.findById(id)
                    .select('-password')
                    .populate('teachSubject', 'subName sessions')
                    .populate('school', 'schoolName')
                    .populate('teachSclass', 'sclassName');
                break;
            default:
                return res.status(400).json({ message: 'Invalid user role' });
        }

        if (!user) {
            // Clear invalid cookie
            res.clearCookie('token', getCookieOptions());
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user, role });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

/**
 * Logout user - clears the httpOnly cookie
 */
const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getCurrentUser, logout };
