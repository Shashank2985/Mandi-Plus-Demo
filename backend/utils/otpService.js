const axios = require('axios');
require('dotenv').config();

const TWOFACTOR_API_KEY = process.env.TWOFACTOR_API_KEY;
const TWOFACTOR_BASE_URL = 'https://2factor.in/API/V1';

// ⚠️ ISSUE #6: In-memory OTP storage
// OTPs stored in memory will be lost on server restart
// Won't work with horizontal scaling (multiple server instances)
// No persistence across deployments
// FIX: Use Redis or MongoDB for OTP storage with TTL
//   - Persists across restarts
//   - Works with multiple server instances
//   - Automatic expiration
const otpStore = new Map();  // ❌ Lost on server restart, doesn't scale

/**
 * Send OTP to the given mobile number using 2Factor AUTOGEN2
 * @param {string} mobileNumber - Mobile number to send OTP to (without country code)
 * @returns {Promise<{success: boolean, requestId?: string, message?: string}>}
 */
const sendOTP = async (mobileNumber) => {
    try {
        const response = await axios.get(
            `${TWOFACTOR_BASE_URL}/${TWOFACTOR_API_KEY}/SMS/${mobileNumber}/AUTOGEN2/OTP`
        );

        if (response.data.Status === 'Success') {
            // Store OTP in memory with 5 minute expiry
            otpStore.set(mobileNumber, {
                otp: response.data.OTP,
                expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
                requestId: response.data.Details
            });

            // Set timeout to clear expired OTP
            setTimeout(() => {
                const otpData = otpStore.get(mobileNumber);
                if (otpData && otpData.expiresAt <= Date.now()) {
                    otpStore.delete(mobileNumber);
                }
            }, 5 * 60 * 1000);

            return {
                success: true,
                requestId: response.data.Details
            };
        }

        return {
            success: false,
            message: response.data.Details || 'Failed to send OTP'
        };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return {
            success: false,
            message: error.response?.data?.Details || 'Failed to send OTP'
        };
    }
};

/**
 * Verify OTP for the given mobile number
 * @param {string} mobileNumber - Mobile number to verify OTP for (without country code)
 * @param {string} otp - OTP to verify
 * @returns {Promise<{success: boolean, message?: string}>}
 */
const verifyOTP = (mobileNumber, otp) => {
    const otpData = otpStore.get(mobileNumber);

    // Check if OTP exists
    if (!otpData) {
        return {
            success: false,
            message: 'OTP expired or not requested'
        };
    }

    // Check if OTP is expired
    if (otpData.expiresAt < Date.now()) {
        otpStore.delete(mobileNumber);
        return {
            success: false,
            message: 'OTP has expired'
        };
    }

    // Verify OTP
    if (otpData.otp !== otp) {
        return {
            success: false,
            message: 'Invalid OTP'
        };
    }

    // Clear OTP after successful verification
    otpStore.delete(mobileNumber);

    return {
        success: true
    };
};

module.exports = {
    sendOTP,
    verifyOTP
};
