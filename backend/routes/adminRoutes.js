const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/adminAuth');
const {
    loginAdmin,
    getAllUsers,
    getAllInsuranceForms,
    getUserInsuranceForms
} = require('../controllers/adminController');
const { adminLoginLimiter } = require('../middleware/rateLimiter');

// ⚠️ ISSUE #8: Missing input validation
// No validation for email format, password requirements
// ⚠️ ISSUE #9: No rate limiting
// Admin login endpoint vulnerable to brute force attacks
// Public routes
router.post('/login', adminLoginLimiter, loginAdmin);  // ❌ No rate limiting, no input validation

// Protected routes (require admin authentication)
router.use(adminAuth);

// User management
router.get('/users', getAllUsers);

// Insurance forms management
router.get('/insurance-forms', getAllInsuranceForms);
router.get('/user/:userId/forms', getUserInsuranceForms);

module.exports = router;
