# Issues Found in MandiPlus Backend Codebase

**Date:** 2025-01-27  
**Scan Type:** Complete Backend & Schema Analysis

---

## 🔴 Critical Issues

### 1. Missing Mongoose Import in adminController.js

**Location:** `backend/controllers/adminController.js:122`

**Issue:**
The code uses `mongoose.Types.ObjectId.isValid()` but doesn't import mongoose at the top of the file.

**Current Code:**
```javascript
const User = require('../models/User');
const InsuranceForm = require('../models/InsuranceForm');
const { verifyAdmin, generateAdminToken } = require('../middleware/adminAuth');

// Later in the code:
if (!mongoose.Types.ObjectId.isValid(userId)) {  // ❌ mongoose is not imported
```

**Impact:**
- Will cause a `ReferenceError: mongoose is not defined` when trying to validate user IDs
- The `/api/admin/user/:userId/forms` endpoint will crash

**Fix:**
Add `const mongoose = require('mongoose');` at the top of the file.

---

### 2. File Upload Inconsistency in insuranceController.js

**Location:** `backend/controllers/insuranceController.js:92`

**Issue:**
The route uses `upload.single('weightmentSlip')` which stores the file in `req.file`, but the controller checks for `req.files?.weightmentSlip?.[0]` (which is for multiple file uploads).

**Current Code:**
```javascript
// In routes/insuranceRoutes.js:
upload.single('weightmentSlip'),  // Single file → req.file

// In controllers/insuranceController.js:
if (req.files?.weightmentSlip?.[0]) {  // ❌ Should be req.file
    weightmentSlipPath = req.files.weightmentSlip[0].path;
}
```

**Impact:**
- File uploads will always fail silently
- Weightment slip images won't be saved
- PDFs will be generated without weightment slip images

**Fix:**
Change to:
```javascript
if (req.file) {
    weightmentSlipPath = req.weightmentSlipPath;  // Already processed in route middleware
}
```

---

## 🟡 Security Issues

### 3. Hardcoded Admin Credentials

**Location:** `backend/middleware/adminAuth.js:3-6`

**Issue:**
Admin credentials are hardcoded directly in the source code instead of using environment variables.

**Current Code:**
```javascript
const ADMIN_CREDENTIALS = {
    email: 'admin@mandiplus.com',
    password: 'pass1234'  // ❌ Hardcoded password
};
```

**Impact:**
- Security risk if code is committed to version control
- Cannot change credentials without code deployment
- Violates security best practices
- Password is visible to anyone with code access

**Fix:**
Move to environment variables:
```javascript
const ADMIN_CREDENTIALS = {
    email: process.env.ADMIN_EMAIL || 'admin@mandiplus.com',
    password: process.env.ADMIN_PASSWORD  // Must be set in .env
};
```

**Recommendation:**
- Use strong password hashing (bcrypt) instead of plain text comparison
- Consider implementing proper admin user model in database

---

## 🟠 Configuration & Architecture Issues

### 4. Cloudinary Dependency Not Used

**Location:** `backend/package.json` and file upload implementation

**Issue:**
Cloudinary and `multer-storage-cloudinary` are installed as dependencies, but the code uses local file storage instead.

**Current Implementation:**
- Files are saved to local `uploads/` directory
- Uses `multer.memoryStorage()` and manual file writing
- No Cloudinary integration in the codebase

**Impact:**
- Unused dependencies increase bundle size
- Files stored locally won't scale in production
- No CDN benefits for file delivery
- Local storage can fill up server disk space
- Files lost if server is redeployed/reset

**Recommendation:**
Either:
1. **Remove unused dependencies** if local storage is intentional
2. **Implement Cloudinary** for production-ready file storage:
   - Better scalability
   - CDN delivery
   - Automatic image optimization
   - No local disk usage

---

### 5. Missing Environment Variable Validation

**Location:** `backend/server.js` and throughout the codebase

**Issue:**
The code uses environment variables without validation, which can cause runtime errors if they're missing.

**Missing Validations:**
- `MONGODB_URI` - Server will crash if not set
- `JWT_SECRET` - Authentication will fail silently
- `TWOFACTOR_API_KEY` - OTP sending will fail
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` - If moved to env vars

**Impact:**
- Silent failures in production
- Difficult to debug configuration issues
- Poor developer experience

**Recommendation:**
Add startup validation:
```javascript
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'TWOFACTOR_API_KEY'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Missing required environment variable: ${varName}`);
        process.exit(1);
    }
});
```

---

## 🟢 Code Quality & Best Practices

### 6. In-Memory OTP Storage

**Location:** `backend/utils/otpService.js:8`

**Issue:**
OTPs are stored in an in-memory Map, which will be lost on server restart or in multi-instance deployments.

**Current Implementation:**
```javascript
const otpStore = new Map();  // ❌ Lost on restart
```

**Impact:**
- OTPs lost on server restart
- Won't work in horizontal scaling (multiple server instances)
- No persistence across deployments

**Recommendation:**
Use Redis or MongoDB for OTP storage:
- Persists across restarts
- Works with multiple server instances
- Can set TTL automatically

---

### 7. No Error Handling for PDF Generation

**Location:** `backend/controllers/insuranceController.js:97-110`

**Issue:**
PDF generation with Puppeteer can fail (browser launch issues, memory problems, etc.) but errors might not be handled gracefully.

**Current Code:**
```javascript
const pdfBuffer = await generatePDF({...});  // No try-catch around this specific call
```

**Impact:**
- Server crashes if Puppeteer fails
- No user-friendly error messages
- No retry mechanism

**Recommendation:**
Add specific error handling for PDF generation with fallback behavior.

---

### 8. Missing Input Validation

**Location:** Multiple controllers

**Issue:**
While `express-validator` is installed, it's not being used for request validation.

**Missing Validations:**
- Mobile number format validation (partially done manually)
- Email format validation for admin login
- Numeric validation for quantity, rate
- String length limits
- Required field checks

**Impact:**
- Invalid data can be stored in database
- Potential security vulnerabilities
- Poor data quality

**Recommendation:**
Implement express-validator middleware for all routes.

---

### 9. No Rate Limiting

**Location:** All routes

**Issue:**
No rate limiting implemented for API endpoints, making the system vulnerable to:
- Brute force attacks on OTP verification
- DDoS attacks
- API abuse

**Impact:**
- Security vulnerabilities
- Potential service disruption
- Unnecessary API costs (2Factor API)

**Recommendation:**
Add `express-rate-limit` middleware, especially for:
- `/api/auth/send-otp` - Limit OTP requests per IP
- `/api/auth/verify-otp` - Limit verification attempts
- `/api/admin/login` - Limit login attempts

---

### 10. CORS Configuration Too Permissive

**Location:** `backend/server.js:12`

**Issue:**
CORS is enabled for all origins without restrictions.

**Current Code:**
```javascript
app.use(cors());  // ❌ Allows all origins
```

**Impact:**
- Security risk - any website can make requests
- Potential CSRF attacks
- Unauthorized API access

**Recommendation:**
Configure CORS to allow only specific origins:
```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
```

---

## 📋 Summary

### Priority Breakdown

**🔴 Critical (Fix Immediately):**
1. Missing mongoose import
2. File upload inconsistency

**🟡 High Priority (Fix Soon):**
3. Hardcoded admin credentials
4. Missing environment variable validation

**🟠 Medium Priority (Plan for Next Sprint):**
5. Cloudinary not used / local storage issues
6. In-memory OTP storage
7. No rate limiting

**🟢 Low Priority (Technical Debt):**
8. Missing input validation
9. CORS configuration
10. PDF generation error handling

### Total Issues Found: 10

---

## 🔧 Quick Fix Checklist

- [ ] Add `const mongoose = require('mongoose');` to adminController.js
- [ ] Fix file upload to use `req.file` instead of `req.files`
- [ ] Move admin credentials to environment variables
- [ ] Add environment variable validation on server startup
- [ ] Decide on Cloudinary vs local storage and implement consistently
- [ ] Add rate limiting middleware
- [ ] Configure CORS properly
- [ ] Add input validation using express-validator
- [ ] Consider Redis for OTP storage
- [ ] Add better error handling for PDF generation

---

**Note:** This document should be updated as issues are resolved or new issues are discovered.

