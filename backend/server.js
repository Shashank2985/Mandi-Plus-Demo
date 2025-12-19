require('dotenv').config();
// ⚠️ ISSUE #5: Missing environment variable validation
// Server will crash at runtime if required env vars are missing
// No validation on startup to catch missing config early
// FIX: Add validation before starting server:
//   const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'TWOFACTOR_API_KEY'];
//   requiredEnvVars.forEach(varName => {
//       if (!process.env[varName]) {
//           console.error(`Missing required environment variable: ${varName}`);
//           process.exit(1);
//       }
//   });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const insuranceRoutes = require('./routes/insuranceRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
// ⚠️ ISSUE #10: CORS configuration too permissive
// Allows ALL origins - security risk! Any website can make requests to your API
// FIX: Configure specific origins:
//   app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(cors());  // ❌ SECURITY: Allows all origins
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
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