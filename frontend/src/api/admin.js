import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Set the auth token for requests
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Get token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('adminToken');
};

// Initialize axios headers with token if it exists
const token = getAuthToken();
if (token) {
    setAuthToken(token);
}

// Admin Auth API
export const adminAuthAPI = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                setAuthToken(response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout: () => {
        localStorage.removeItem('adminToken');
        delete axios.defaults.headers.common['Authorization'];
    },

    isAuthenticated: () => {
        return !!getAuthToken();
    },
};

// Admin Users API
export const adminUsersAPI = {
    getAllUsers: async () => {
        try {
            const response = await axios.get(`${API_URL}/users`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

// Admin Insurance Forms API
export const adminInsuranceAPI = {
    getAllForms: async () => {
        try {
            const response = await axios.get(`${API_URL}/insurance-forms`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getUserForms: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}/forms`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    viewPdf: (pdfUrl) => {
        if (!pdfUrl) {
            console.warn('No PDF URL provided');
            return;
        }

        // Check if the URL is already a complete URL
        if (pdfUrl.startsWith('http')) {
            window.open(pdfUrl, '_blank');
            return;
        }

        // Handle both absolute and relative paths
        let finalUrl = pdfUrl;
        if (!pdfUrl.startsWith('/')) {
            finalUrl = `/${pdfUrl}`;
        }

        // Ensure we don't have double slashes
        finalUrl = finalUrl.replace(/([^:]\/)\/+/g, '$1');

        // Use the correct base URL
        const baseUrl = 'http://localhost:5000';
        const fullUrl = `${baseUrl}${finalUrl}`;

        console.log('Opening PDF URL:', fullUrl);
        window.open(fullUrl, '_blank');
    },
};
