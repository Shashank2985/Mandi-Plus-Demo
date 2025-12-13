import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { registerUser } from '../api/auth';

const indianStates = [
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Manipur', label: 'Manipur' },
    { value: 'Meghalaya', label: 'Meghalaya' },
    { value: 'Mizoram', label: 'Mizoram' },
    { value: 'Nagaland', label: 'Nagaland' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Sikkim', label: 'Sikkim' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Tripura', label: 'Tripura' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Uttarakhand', label: 'Uttarakhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
    { value: 'Ladakh', label: 'Ladakh' },
    { value: 'Puducherry', label: 'Puducherry' },
    { value: 'Chandigarh', label: 'Chandigarh' },
    { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
    { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'Lakshadweep', label: 'Lakshadweep' },
];

const userCategories = [
    { value: 'buyer', label: 'Buyer' },
    { value: 'seller', label: 'Seller' },
    { value: 'transporter', label: 'Transporter' },
];

const countryCodes = [
    { value: '+91', label: 'India (+91)' },
    { value: '+1', label: 'USA (+1)' },
    { value: '+44', label: 'UK (+44)' },
    // Add more as needed
];

const Register = () => {
    const [formData, setFormData] = useState({
        countryCode: '+91',
        mobileNumber: '',
        category: '',
        state: '',
        otp: '',
    });
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSendOtp = () => {
        if (!formData.mobileNumber) {
            setError('Please enter phone number');
            return;
        }
        setOtpSent(true);
        setError('');
    };

    const handleOtpChange = (e) => {
        const value = e.target.value;
        if (value.length <= 6 && /^\d*$/.test(value)) {
            setFormData({ ...formData, otp: value });
            if (value === '000000') {
                setOtpVerified(true);
            } else {
                setOtpVerified(false);
            }
        }
    };

    const handleRegister = async () => {
        if (!otpVerified) {
            setError('Please verify OTP first');
            return;
        }
        if (!formData.category || !formData.state) {
            setError('Please fill all fields');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = {
                mobileNumber: formData.countryCode + formData.mobileNumber,
                category: formData.category,
                state: formData.state,
            };
            const response = await registerUser(data);
            localStorage.setItem('token', response.token);
            navigate('/home');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <div className="bg-[#25D366] text-white py-4 px-6 shadow-md">
                <h1 className="text-xl font-bold">Register</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    name="mobileNumber"
                                    placeholder="Enter phone number"
                                    value={formData.mobileNumber}
                                    onChange={handleInputChange}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        <Select
                            name="category"
                            placeholder="Select User Category"
                            options={userCategories}
                            value={formData.category}
                            onChange={handleInputChange}
                        />

                        <Select
                            name="state"
                            placeholder="Select State"
                            options={indianStates}
                            value={formData.state}
                            onChange={handleInputChange}
                        />

                        {!otpSent && (
                            <Button onClick={handleSendOtp} className="w-full">
                                Send OTP
                            </Button>
                        )}

                        {otpSent && (
                            <>
                                <Input
                                    type="text"
                                    name="otp"
                                    placeholder="Enter 6-digit OTP"
                                    value={formData.otp}
                                    onChange={handleOtpChange}
                                    maxLength={6}
                                />
                                <Button
                                    onClick={handleRegister}
                                    disabled={!otpVerified || loading}
                                    className="w-full"
                                >
                                    {loading ? 'Registering...' : 'Register'}
                                </Button>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;