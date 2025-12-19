const jwt = require('jsonwebtoken');

// ⚠️ ISSUE #3: SECURITY RISK - Hardcoded admin credentials
// Admin password is hardcoded in source code - major security vulnerability!
// If code is committed to git, password is exposed
// Cannot change credentials without code deployment
// FIX: Move to environment variables:
//   email: process.env.ADMIN_EMAIL || 'admin@mandiplus.com',
//   password: process.env.ADMIN_PASSWORD  // Must be set in .env
// RECOMMENDATION: Use bcrypt for password hashing instead of plain text comparison
const ADMIN_CREDENTIALS = {
    email: process.env.ADMIN_EMAIL || 'admin@mandiplus.com',
    password: process.env.ADMIN_PASSWORD   // ❌ SECURITY RISK: Hardcoded password
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
