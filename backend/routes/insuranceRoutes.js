const express = require('express');
const multer = require('multer');
const path = require('path');
const { createInsuranceForm, getMyInsuranceForms } = require('../controllers/insuranceController');
const auth = require('../middleware/auth');

const router = express.Router();

// ⚠️ ISSUE #4: Cloudinary dependency not used
// Cloudinary and multer-storage-cloudinary are installed but not used
// Files are stored locally instead - won't scale in production
// FIX: Either remove unused dependencies OR implement Cloudinary for production-ready storage
// Configure multer for memory storage
const storage = multer.memoryStorage();  // ❌ Local storage - consider Cloudinary

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for weightment slip'));
        }
    },
});

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Save file from memory to disk
const processUpload = (file) => {
    if (!file) return null;

    const extension = file.originalname.split('.').pop();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, file.buffer);
    return filepath;
};

// Routes
// ⚠️ ISSUE #2: File upload - upload.single() puts file in req.file (single file)
// The controller incorrectly checks req.files (multiple files) - see insuranceController.js line 92
// ⚠️ ISSUE #8: Missing input validation
// No validation for required fields, data types, string lengths, numeric ranges
// express-validator is installed but not used
router.post('/create',
    auth,
    upload.single('weightmentSlip'),  // ✅ This puts file in req.file (single file)
    (req, res, next) => {
        try {
            if (req.file) {
                // Process the uploaded file and save to disk
                const filePath = processUpload(req.file);
                req.weightmentSlipPath = filePath;  // ✅ File path stored here for controller
            }
            next();
        } catch (error) {
            next(error);
        }
    },
    createInsuranceForm  // ❌ No input validation middleware
);

router.get('/my-forms', auth, getMyInsuranceForms);

module.exports = router;