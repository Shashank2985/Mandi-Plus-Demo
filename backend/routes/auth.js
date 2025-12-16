const express = require('express');
const { sendOtp, verifyOtpAndRegister } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/send-otp - Send OTP to mobile number
router.post('/send-otp', sendOtp);

// POST /api/auth/verify-otp - Verify OTP and register/login user
router.post('/verify-otp', verifyOtpAndRegister);

module.exports = router;