import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      setError('Enter valid mobile number');
      return;
    }
    setOtpSent(true);
    setError('');
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }

    if (newOtp.join('') === '0000') {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-lg relative">
        
        {/* Close Button */}
        <button className="absolute right-4 top-4 text-2xl font-bold">
          ×
        </button>

        <h2 className="text-lg font-semibold mb-1">
          {otpSent ? 'Verify your OTP' : 'Welcome to DeHaat Kisan App'}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {otpSent ? `Sent via SMS to ${mobile}` : 'Login or Register'}
        </p>

        {!otpSent && (
          <>
            <div className="flex items-center border rounded-xl px-4 py-3 mb-4 bg-gray-100">
              <input
                type="tel"
                maxLength="10"
                placeholder="Enter Mobile Number"
                className="bg-transparent outline-none flex-1"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>

            <p className="text-xs text-gray-500 mb-4">
              By continuing, I agree to{' '}
              <span className="text-green-600">Terms of Use</span> &{' '}
              <span className="text-green-600">Privacy Policy</span>
            </p>

            <button
              onClick={handleSendOtp}
              className="w-full bg-green-600 text-white py-3 rounded-full font-semibold"
            >
              CONTINUE
            </button>
          </>
        )}

        {otpSent && (
          <>
            <div className="flex justify-between mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-14 h-14 text-center text-xl border rounded-xl bg-gray-100"
                />
              ))}
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Didn’t receive OTP?{' '}
              <span className="text-green-600 font-medium cursor-pointer">
                Send again
              </span>
            </p>

            <button className="w-full bg-green-600 text-white py-3 rounded-full font-semibold">
              VERIFY AND CONTINUE
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
