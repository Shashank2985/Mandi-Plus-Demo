import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');
    }, [navigate]);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.mobileNumber || 'user';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#e0d7fc] pb-28">

            {/* HEADER */}
            <div className="bg-white text-black px-5 py-4 rounded-b-4xl">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center bg-white px-2 py-1 rounded-2xl -ml-2">
                        <h2 className="text-2xl font-bold tracking-tight -ml-10"
                            style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <span className="text-slate-800">Mandi</span>
                            <span className="text-[#4309ac]">Plus</span>
                        </h2>
                        <p className="text-xs font-medium">
                            <span className="text-black">Risk Humara, </span>
                            <span className="text-[#4309ac]">Munafa Aapka</span>
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-purple-900 px-2 py-1 rounded-2xl text-sm font-medium flex items-center space-x-1 transition-all duration-300 border border-white border-opacity-20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className="px-5 mt-5">
                <h2 className="text-xl font-semibold mb-4">
                    Our Services
                </h2>

                <div className="grid grid-cols-2 gap-4">

                    {/* Track Deliveries */}
                    <div className="bg-white rounded-3xl p-4 shadow-sm"
                        onClick={() => navigate('/tracking')}>
                        <h4 className="font-semibold mb-1">Track Deliveries</h4>
                        <p className="text-xs text-gray-500">
                            Real-time updates
                        </p>
                    </div>

                    {/* Insurance (maps to your /insurance) */}
                    <div
                        onClick={() => navigate('/insurance')}
                        className="bg-white rounded-3xl p-4 shadow-sm cursor-pointer"
                    >
                        <h4 className="font-semibold mb-1">Insurance</h4>
                        <p className="text-xs text-gray-500 mb-2">
                            Get policy instantly
                        </p>
                        <span className="inline-block text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                            Zero commission
                        </span>
                    </div>

                    {/* Know Your Vehicle */}
                    <div
                        className="bg-white rounded-3xl p-4 shadow-sm cursor-pointer"
                        onClick={() => navigate('/know-your-vehicle')}
                    >
                        <h4 className="font-semibold mb-1">Know Your Vehicle</h4>
                        <p className="text-xs text-gray-500">
                            Check vehicle details
                        </p>
                    </div>

                    {/* My Forms */}
                    <div
                        onClick={() => navigate('/my-insurance-forms')}
                        className="bg-white rounded-3xl p-4 shadow-sm cursor-pointer"
                    >
                        <h4 className="font-semibold mb-1">My Forms</h4>
                        <p className="text-xs text-gray-500">
                            Submitted forms
                        </p>
                    </div>
                </div>
            </div>

            {/* DO MORE */}
            <div className="px-5 mt-5">
                <h2 className="text-2xl mb-2 font-bold tracking-tight"
                    style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <span className="text-slate-800">Do more with Mandi</span>
                    <span className="text-[#4309ac]">Plus</span>
                </h2>

                <div className="bg-white rounded-3xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold text-sm">
                            Explore our other Products
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                            From all RTOs
                        </p>
                    </div>
                    <span className="text-xl">→</span>
                </div>
            </div>

            {/* BOTTOM NAV */}
            <div className="fixed bottom-0 left-0 right-0 bg-black text-white rounded-t-[28px] py-3">
                <div className="flex justify-around items-center text-xs">
                    <div className="flex flex-col items-center opacity-60">
                        ⬜
                        <span>Explore</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center -mt-6">
                            👤
                        </div>
                        <span className="mt-1">Home</span>
                    </div>

                    <div className="flex flex-col items-center opacity-60">
                        💬
                        <span>Support</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
