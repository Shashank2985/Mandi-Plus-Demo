const rateLimit = require('express-rate-limit');

// 1. Limiter for Sending OTP (Prevent SMS Bombing/Cost spikes)
// Allow 3 OTP requests per 15 minutes per IP
const sendOtpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    message: {
        success: false,
        message: "Too many OTP requests. Please try again after 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// 2. Limiter for Verifying OTP (Prevent Brute Force)
// Allow 5 verification attempts per 15 minutes per IP
const verifyOtpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        success: false,
        message: "Too many failed attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// 3. Limiter for Admin Login (Prevent Brute Force on Admin Panel)
// Allow 5 login attempts per hour per IP
const adminLoginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts. Please try again after an hour."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// 4. General Limiter (Prevent DDoS on general API routes)
// Allow 100 requests per 15 minutes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
});

module.exports = {
    sendOtpLimiter,
    verifyOtpLimiter,
    adminLoginLimiter,
    apiLimiter
};