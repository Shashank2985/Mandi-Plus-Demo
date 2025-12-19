const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { createInsuranceForm, getMyInsuranceForms } = require('../controllers/insuranceController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ⚠️ ISSUE #4: Cloudinary dependency not used
// Cloudinary and multer-storage-cloudinary are installed but not used
// Files are stored locally instead - won't scale in production
// FIX: Either remove unused dependencies OR implement Cloudinary for production-ready storage

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image (JPEG, JPG, PNG) and PDF files are allowed'));
        }
    }
});

// Input validation rules
const validateInsuranceForm = [
    body('supplierName').trim().notEmpty().withMessage('Supplier name is required')
        .isLength({ max: 100 }).withMessage('Supplier name must be less than 100 characters'),
    body('supplierAddress').trim().notEmpty().withMessage('Supplier address is required'),
    body('placeOfSupply').trim().notEmpty().withMessage('Place of supply is required'),
    body('buyerName').trim().notEmpty().withMessage('Buyer name is required')
        .isLength({ max: 100 }).withMessage('Buyer name must be less than 100 characters'),
    body('buyerAddress').trim().notEmpty().withMessage('Buyer address is required'),
    body('itemName').trim().notEmpty().withMessage('Item name is required'),
    body('hsn').trim().notEmpty().withMessage('HSN code is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number')
        .isFloat({ gt: 0 }).withMessage('Quantity must be greater than 0'),
    body('rate').isNumeric().withMessage('Rate must be a number')
        .isFloat({ gt: 0 }).withMessage('Rate must be greater than 0'),
    body('vehicleNumber').trim().notEmpty().withMessage('Vehicle number is required')
        .matches(/^[A-Z]{2}\s?[0-9]{1,2}\s?[A-Z]{0,2}\s?[0-9]{4}$/i)
        .withMessage('Invalid vehicle number format. Expected format: UP 12 AB 1234 or UP121234'),
    body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Routes
// ⚠️ ISSUE #2: File upload - upload.single() puts file in req.file (single file)
// The controller incorrectly checks req.files (multiple files) - see insuranceController.js line 92
// ⚠️ ISSUE #8: Missing input validation
// No validation for required fields, data types, string lengths, numeric ranges
// express-validator is installed but not used
router.post('/create',
    auth,
    upload.single('weightmentSlip'),
    validateInsuranceForm,
    (req, res, next) => {
        try {
            // Process file if uploaded
            if (req.file) {
                // Process the uploaded file and save to disk
                req.body.weightmentSlipPath = req.file.path; // File is already saved by multer
            }
            next();
        } catch (error) {
            console.error('Error processing file:', error);
            return res.status(500).json({ message: 'Error processing file' });
        }
    },
    createInsuranceForm  // ❌ No input validation middleware
);

router.get('/my-forms', auth, getMyInsuranceForms);

module.exports = router;