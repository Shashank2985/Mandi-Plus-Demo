import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const mobileNumber = user.mobileNumber || 'User';

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <div className="bg-[#25D366] text-white py-4 px-6 shadow-md">
                <h1 className="text-xl font-bold">Mandi Plus</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-[#25D366] rounded-full mx-auto flex items-center justify-center mb-4">
                            <span className="text-white text-2xl font-bold">M</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {mobileNumber}!</h2>
                        <p className="text-gray-600">You have successfully registered and are now logged in.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">What's Next?</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Browse mandi prices</li>
                                <li>• Connect with buyers/sellers</li>
                                <li>• Manage your transactions</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-[#25D366] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#20c157] transition-colors"
                        >
                            Explore App
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;