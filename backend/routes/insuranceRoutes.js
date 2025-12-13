const express = require('express');
const multer = require('multer');
const path = require('path');
const { createInsuranceForm, getMyInsuranceForms } = require('../controllers/insuranceController');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

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
router.post('/create',
    auth,
    upload.single('weightmentSlip'),
    (req, res, next) => {
        try {
            if (req.file) {
                // Process the uploaded file and save to disk
                const filePath = processUpload(req.file);
                req.weightmentSlipPath = filePath;
            }
            next();
        } catch (error) {
            next(error);
        }
    },
    createInsuranceForm
);

router.get('/my-forms', auth, getMyInsuranceForms);

module.exports = router;