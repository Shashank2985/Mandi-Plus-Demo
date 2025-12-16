const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP, verifyOTP } = require('../utils/otpService');

// @desc    Send OTP to mobile number
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!mobileNumber) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number is required'
            });
        }

        // Remove any non-digit characters and country code if present
        const cleanNumber = mobileNumber.replace(/\D/g, '').replace(/^91/, '');

        if (cleanNumber.length !== 10) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit mobile number'
            });
        }

        const result = await sendOTP(cleanNumber);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message || 'Failed to send OTP'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while sending OTP'
        });
    }
};

// @desc    Verify OTP and register/login user
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtpAndRegister = async (req, res) => {
    try {
        const { mobileNumber, otp, category, state } = req.body;

        // Validation
        if (!mobileNumber || !otp || !category || !state) {
            return res.status(400).json({
                success: false,
                message: 'Please provide mobileNumber, OTP, category, and state'
            });
        }

        // Clean mobile number
        const cleanNumber = mobileNumber.replace(/\D/g, '').replace(/^91/, '');

        // Verify OTP
        const otpVerification = verifyOTP(cleanNumber, otp);
        if (!otpVerification.success) {
            return res.status(400).json({
                success: false,
                message: otpVerification.message || 'Invalid OTP'
            });
        }

        // Check if user exists
        let user = await User.findOne({ mobileNumber: cleanNumber });

        if (!user) {
            // Create new user if not exists
            user = new User({
                mobileNumber: cleanNumber,
                category,
                state,
                verified: true
            });
            await user.save();
        } else {
            // Update existing user's verification status
            user.verified = true;
            await user.save();
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '30d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                mobileNumber: user.mobileNumber,
                category: user.category,
                state: user.state,
                verified: user.verified,
            },
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during OTP verification'
        });
    }
};

module.exports = {
    sendOtp,
    verifyOtpAndRegister,
};