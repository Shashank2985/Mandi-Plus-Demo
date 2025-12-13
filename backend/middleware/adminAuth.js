const jwt = require('jsonwebtoken');

const ADMIN_CREDENTIALS = {
    email: 'admin@mandiplus.com',
    password: 'pass1234'
};

// Admin authentication middleware
const adminAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify that the token is for an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

// Admin login verification
const verifyAdmin = (email, password) => {
    return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
};

// Generate admin JWT token
const generateAdminToken = () => {
    return jwt.sign(
        {
            email: ADMIN_CREDENTIALS.email,
            role: 'admin',
            id: 'admin'
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );
};

module.exports = {
    adminAuth,
    verifyAdmin,
    generateAdminToken
};
