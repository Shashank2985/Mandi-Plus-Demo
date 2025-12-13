const express = require('express');
const multer = require('multer');
const path = require('path');
const { createInsuranceForm, getMyInsuranceForms } = require('../controllers/insuranceController');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and image files are allowed'));
        }
    },
});

// Routes
router.post('/create', auth, upload.fields([
    { name: 'weightmentSlip', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 },
]), createInsuranceForm);

router.get('/my-forms', auth, getMyInsuranceForms);

module.exports = router;