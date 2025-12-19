const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    identifier: {
        type: String, // Can be phone number or email
        required: true,
        index: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // ⚠️ Automatically delete doc after 300 seconds (5 minutes)
    }
});

module.exports = mongoose.model('Otp', otpSchema);