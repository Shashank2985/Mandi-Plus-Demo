const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { mobileNumber, category, state } = req.body;

        // Validation
        if (!mobileNumber || !category || !state) {
            return res.status(400).json({
                success: false,
                message: 'Please provide mobileNumber, category, and state'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create new user
        const user = new User({
            mobileNumber,
            category,
            state,
        });

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '30d' }
        );

        res.status(201).json({
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
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

module.exports = {
    register,
};