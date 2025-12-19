const express = require('express');
const { sendOtp, verifyOtpAndRegister } = require('../controllers/authController');

const router = express.Router();

// ⚠️ ISSUE #8: Missing input validation
// express-validator is installed but not used here
// No validation for mobile number format, OTP format, category enum, etc.
// ⚠️ ISSUE #9: No rate limiting
// These endpoints are vulnerable to brute force attacks and API abuse
// No protection against: spam OTP requests, brute force OTP verification
// FIX: Add express-rate-limit middleware to prevent abuse
// POST /api/auth/send-otp - Send OTP to mobile number
router.post('/send-otp', sendOtp);  // ❌ No rate limiting, no input validation

// POST /api/auth/verify-otp - Verify OTP and register/login user
router.post('/verify-otp', verifyOtpAndRegister);  // ❌ No rate limiting, no input validation

module.exports = router;