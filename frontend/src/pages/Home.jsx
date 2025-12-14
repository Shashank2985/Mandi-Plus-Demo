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
    const username = user.mobileNumber || 'User';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        handleNavigate('/');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-purple-50 flex flex-col">

            {/* Greeting Section */}
            <div className="bg-linear-to-r from-gray-900 via-purple-900 to-purple-800 text-white py-6 px-6 rounded-b-3xl shadow-lg mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Welcome, {username}</h3>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-purple-900 px-4 py-2 rounded-2xl text-sm font-medium flex items-center space-x-2 transition-all duration-300 border border-white border-opacity-20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Services Title */}
            <div className="px-6 mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Our Services</h3>
                <p className="text-sm text-gray-500">Quick access to everything you need</p>
            </div>

            {/* Services Grid */}
            <div className="px-6 pb-24 flex-1">
                <div className="grid grid-cols-2 gap-5">
                    {/* Card 1 - Track Deliveries */}
                    <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-3xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-yellow-200 transform hover:-translate-y-1">
                        <div className="w-14 h-14 bg-yellow-200 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                            <span className="text-3xl">📦</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base mb-1">Track Deliveries</h4>
                        <p className="text-xs text-gray-600">Real-time GPS updates</p>
                    </div>

                    {/* Card 2 - Insurance */}
                    <div
                        className="bg-linear-to-br from-orange-50 to-orange-100 rounded-3xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-orange-200 cursor-pointer transform hover:-translate-y-1"
                        onClick={() => navigate('/insurance')}
                    >
                        <div className="w-14 h-14 bg-orange-200 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                            <span className="text-3xl">🛡️</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base mb-1">Insurance</h4>
                        <p className="text-xs text-gray-600">Get instant policy</p>
                    </div>

                    {/* Card 3 - Generate Invoices */}
                    <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-3xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-200 transform hover:-translate-y-1">
                        <div className="w-14 h-14 bg-blue-200 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                            <span className="text-3xl">📄</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base mb-1">Generate Invoices</h4>
                        <p className="text-xs text-gray-600">Simplify your billing</p>
                    </div>

                    {/* Card 4 - My Forms */}
                    <div
                        className="bg-linear-to-br from-purple-50 to-purple-100 rounded-3xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-purple-200 cursor-pointer transform hover:-translate-y-1"
                        onClick={() => navigate('/my-insurance-forms')}
                    >
                        <div className="w-14 h-14 bg-purple-200 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                            <span className="text-3xl">💳</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base mb-1">My Forms</h4>
                        <p className="text-xs text-gray-600">View submitted forms</p>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white backdrop-blur-lg bg-opacity-95 border-t border-gray-200 shadow-2xl rounded-t-3xl">
                <div className="grid grid-cols-4 text-center py-3">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-1 shadow-md">
                            <span className="text-xl">🏠</span>
                        </div>
                        <p className="text-xs font-semibold text-purple-700">Home</p>
                    </div>
                    <div className="flex flex-col items-center opacity-60">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-1">
                            <span className="text-xl">📦</span>
                        </div>
                        <p className="text-xs text-gray-500">Orders</p>
                    </div>
                    <div className="flex flex-col items-center opacity-60">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-1">
                            <span className="text-xl">📜</span>
                        </div>
                        <p className="text-xs text-gray-500">History</p>
                    </div>
                    <div className="flex flex-col items-center opacity-60">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-1">
                            <span className="text-xl">☰</span>
                        </div>
                        <p className="text-xs text-gray-500">Menu</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;