import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Set auth token in headers
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Send OTP to mobile number
export const sendOtp = async (mobileNumber) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, { mobileNumber });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to send OTP' };
    }
};

// Verify OTP and complete registration
export const verifyOtpAndRegister = async (data) => {
    try {
        // Clean mobile number (remove any non-digit characters and leading 91 if present)
        const cleanMobileNumber = data.mobileNumber.replace(/\D/g, '').replace(/^91/, '');

        const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
            ...data,
            mobileNumber: cleanMobileNumber
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            setAuthToken(response.data.token);
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'OTP verification failed' };
    }
};

// Get current user
export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        setAuthToken(token);
        const response = await axios.get(`${API_BASE_URL}/auth/me`);
        return response.data;
    } catch (error) {
        localStorage.removeItem('token');
        setAuthToken(null);
        return null;
    }
};

export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};