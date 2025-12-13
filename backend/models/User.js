const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        enum: ['buyer', 'seller', 'transporter'],
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);