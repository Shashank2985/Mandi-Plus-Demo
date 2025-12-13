const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/adminAuth');
const {
    loginAdmin,
    getAllUsers,
    getAllInsuranceForms,
    getUserInsuranceForms
} = require('../controllers/adminController');

// Public routes
router.post('/login', loginAdmin);

// Protected routes (require admin authentication)
router.use(adminAuth);

// User management
router.get('/users', getAllUsers);

// Insurance forms management
router.get('/insurance-forms', getAllInsuranceForms);
router.get('/user/:userId/forms', getUserInsuranceForms);

module.exports = router;
