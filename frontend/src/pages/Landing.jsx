import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* Main Card */}
            <div className="bg-[#175f31] h-[calc(100vh-2rem)] rounded-4xl shadow-xl p-8 w-full max-w-sm text-center text-white relative mx-auto flex flex-col justify-center items-center">
                {/* Logo/Text */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Mandi Plus</h1>
                    <p className="text-lg opacity-90">Your Mandi Connection</p>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <p className="text-sm opacity-80">
                        Connect with farmers, buyers, and transporters in your area
                    </p>

                    {/* Small circular icon at bottom */}
                    <div className="flex justify-center">
                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">M</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Arrow Button */}
            <button
                onClick={() => navigate('/register')}
                className="fixed bottom-4 right-4 w-12 h-12 bg-[#25D366] text-white rounded-full shadow-md hover:bg-[#20c157] transition-colors flex items-center justify-center"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Landing;