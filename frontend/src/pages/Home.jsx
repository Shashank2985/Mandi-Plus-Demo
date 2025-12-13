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
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Greeting Section */}
            <div className="bg-linear-to-r from-green-900 to-green-700 text-white py-6 px-6 rounded-b-xl mb-5">
                <div className="flex items-center space-x-4">
                    <div>
                        <h2 className="text-xl font-bold">Welcome, {username}!</h2>
                    </div>
                    {/* Right: Logout */}
                    <div className="flex-1 text-right">
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 ml-auto"
                        >
                            <span>🚪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Services Title */}
            <div className="grid grid-cols-2 gap-x-4 mx-2 my-4 py-3">
                <h3 className="text-lg font-bold text-gray-800">📋 Our Services</h3>
                <p className="text-sm text-gray-500">Quick access to everything</p>
            </div>

            {/* Services Grid */}
            <div className="px-6 pb-20">
                <div className="grid grid-cols-2 gap-4">
                    {/* Card 1 */}
                    <div className="bg-yellow-100 rounded-2xl p-4 shadow-sm">
                        <div className="text-3xl mb-2">📦</div>
                        <h4 className="font-bold text-green-800">Track your deliveries</h4>
                        <p className="text-xs text-gray-600">Realtime GPS updates</p>
                    </div>

                    {/* Card 2 */}
                    <div
                        className="bg-orange-100 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-orange-200 transition-colors"
                        onClick={() => navigate('/insurance')}
                    >
                        <div className="text-3xl mb-2">🛡️</div>
                        <h4 className="font-bold text-green-800">Insurance</h4>
                        <p className="text-xs text-gray-600">Get instant policy</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-blue-100 rounded-2xl p-4 shadow-sm">
                        <div className="text-3xl mb-2">📄</div>
                        <h4 className="font-bold text-green-800">Generate Invoices</h4>
                        <p className="text-xs text-gray-600">Simplify your billing</p>
                    </div>

                    {/* Card 4 */}
                    <div
                        className="bg-green-100 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-green-200 transition-colors"
                        onClick={() => navigate('/my-insurance-forms')}
                    >
                        <div className="text-3xl mb-2">💳</div>
                        <h4 className="font-bold text-green-800">My Forms</h4>
                        <p className="text-xs text-gray-600">View submitted forms</p>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
                <div className="grid grid-cols-4 text-center">
                    <div className="text-green-600">
                        <div className="text-xl">🏠</div>
                        <p className="text-xs font-medium">Home</p>
                    </div>
                    <div className="text-gray-400">
                        <div className="text-xl">📦</div>
                        <p className="text-xs">Orders</p>
                    </div>
                    <div className="text-gray-400">
                        <div className="text-xl">📜</div>
                        <p className="text-xs">History</p>
                    </div>
                    <div className="text-gray-400">
                        <div className="text-xl">☰</div>
                        <p className="text-xs">Menu</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;