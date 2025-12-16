# MandiPlus - Vehicle Insurance Platform

## 🚀 Project Overview
MandiPlus is a comprehensive vehicle insurance platform that streamlines the insurance application and management process. The platform offers a seamless experience for users to apply for vehicle insurance, track their applications, and manage their policies through an intuitive interface.

### Key Features
- Mobile number based authentication with OTP
- Vehicle insurance application with form submission
- Document upload and management via Cloudinary
- PDF generation for insurance policies
- Admin dashboard for managing applications
- Real-time status tracking
- Responsive design with Tailwind CSS

## 🛠️ Tech Stack
- **Frontend**: 
  - React 19
  - React Router v7
  - Tailwind CSS
  - Vite
  - Axios for API calls
  - jsPDF for PDF generation

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - 2Factor for OTP service
  - Cloudinary for file storage
  - jsPDF for PDF generation

## 📁 Folder Structure
```
MandiPlus/
├── backend/               # Backend server code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── templates/        # Email/PDF templates
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   └── server.js         # Entry point
│
└── frontend/             # Frontend React application
    ├── public/           # Static files
    └── src/
        ├── api/          # API service calls
        ├── assets/       # Images, fonts, etc.
        ├── components/   # Reusable UI components
        ├── pages/        # Page components
        └── App.jsx       # Main App component
```

## ⚙️ Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher) or yarn
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for file storage)
- 2Factor account (for OTP service)

## 🔑 Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# 2Factor OTP
TWOFACTOR_API_KEY=your_2factor_api_key
OTP_SECRET=your_otp_secret

```

## 🚀 Local Development Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see above)
4. Start the development server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 🔒 Authentication Flow
1. User enters mobile number
2. System sends OTP via 2Factor service
3. User verifies OTP
4. JWT token is issued upon successful verification
5. Token is stored in local storage for subsequent requests

## 👨‍💼 Admin Panel
- **URL**: `/admin`
- **Default Credentials**:
  - Email: admin@mandiplus.com
  - Password: (Set in environment variables)

### Admin Features
- View all insurance applications
- Update application status
- Generate and download PDFs
- Manage users and policies

## 📄 File Upload & PDF Handling
- Files are uploaded and stored locally in the uploads folder as of now.
- PDFs are generated using jsPDF
- Documents are stored with secure access URLs

## 🔍 Troubleshooting

### Common Issues
1. **MongoDB Connection Issues**
   - Ensure MongoDB is running locally or the connection string is correct
   - Check network connectivity for remote databases

2. **OTP Not Received**
   - Verify the mobile number format
   - Check 2Factor API key and account status
   - Ensure sufficient balance in 2Factor account

3. **Cloudinary Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits (default: 10MB)
   - Ensure proper CORS configuration

4. **Port Conflicts**
   - Default ports: 5000 (backend), 5173 (frontend)
   - Update ports in `.env` if needed

## 📝 Notes
- Always keep your `.env` file secure and never commit it to version control
- Use environment variables for all sensitive information
- The application is designed to be easily deployable to cloud platforms

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- 2Factor for OTP services
- Cloudinary for file storage
- All open-source libraries used in this project
