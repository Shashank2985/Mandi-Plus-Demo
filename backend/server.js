require('dotenv').config();
const { apiLimiter } = require('./middleware/rateLimiter');

// Environment variable validation
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'TWOFACTOR_API_KEY',
    'FRONTEND_URL',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`- ${varName}`));
    process.exit(1);
}

// Log environment mode
console.log(`🚀 Starting server in ${process.env.NODE_ENV || 'development'} mode`);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const insuranceRoutes = require('./routes/insuranceRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
// Configure CORS to only allow requests from the frontend URL
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', apiLimiter)
app.use('/api/auth', authRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/admin', adminRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected successfully');
        console.log('Database:', mongoose.connection.db.databaseName);
        console.log('Connection ready state:', mongoose.connection.readyState); // 1 = connected
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit if connection fails
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});