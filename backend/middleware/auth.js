const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate JWT token for a user
 * @param {Object} user - User object with _id and role
 * @returns {string} JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            role: user.role,
            school: user.school || user._id // For admin, school is their own id
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

/**
 * Cookie options for httpOnly secure cookies
 */
const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
});

/**
 * Authentication middleware - verifies JWT from cookie
 */
const authenticate = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: 'Authentication required. Please log in.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        }
        return res.status(500).json({ message: 'Authentication error.' });
    }
};

/**
 * Authorization middleware - checks if user has required role
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        
        next();
    };
};

/**
 * Verify school access - ensures user can only access their school's data
 */
const verifySchoolAccess = (req, res, next) => {
    const requestedSchoolId = req.params.id || req.body.school || req.body.adminID;
    
    if (requestedSchoolId && req.user.school.toString() !== requestedSchoolId.toString()) {
        return res.status(403).json({ message: 'Access denied. You can only access your own school data.' });
    }
    
    next();
};

module.exports = {
    generateToken,
    getCookieOptions,
    authenticate,
    authorize,
    verifySchoolAccess,
    JWT_SECRET
};
