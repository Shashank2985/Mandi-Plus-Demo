import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyInsuranceForms = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/insurance/my-forms', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setForms(response.data.data);
            } catch (err) {
                setError('Failed to load insurance forms. Please try again later.');
                console.error('Fetch forms error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchForms();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#eae7f6] pb-28">
                {/* Header */}
                <div className="bg-white text-black px-5 py-4 rounded-b-4xl mb-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center text-purple-900 hover:text-purple-700 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <span className="text-slate-800">Mandi</span>
                                <span className="text-[#4309ac]">Plus</span>
                            </h2>
                            <p className="text-xs font-medium">
                                <span className="text-black">Risk Humara, </span>
                                <span className="text-[#4309ac]">Munafa Aapka</span>
                            </p>
                        </div>
                        <div className="w-24"></div> {/* Spacer for balance */}
                    </div>
                </div>

                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your insurance forms...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#e0d7fc] pb-28">
                {/* Header */}
                <div className="bg-white text-black px-5 py-4 rounded-b-4xl mb-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center text-purple-900 hover:text-purple-700 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>

                        </button>
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <span className="text-slate-800">Mandi</span>
                                <span className="text-[#4309ac]">Plus</span>
                            </h2>
                            <p className="text-xs font-medium">
                                <span className="text-black">Risk Humara, </span>
                                <span className="text-[#4309ac]">Munafa Aapka</span>
                            </p>
                        </div>
                        <div className="w-24"></div> {/* Spacer for balance */}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center mx-auto">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#e0d7fc] pb-28">
            {/* Header */}
            <div className="bg-white text-black px-5 py-4 rounded-b-4xl mb-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center text-purple-900 hover:text-purple-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <span className="text-slate-800">Mandi</span>
                            <span className="text-[#4309ac]">Plus</span>
                        </h2>
                    </div>
                    <div className="w-24"></div> {/* Spacer for balance */}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-5">
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        My Insurance Forms
                    </h1>
                    <p className="mt-1 text-md text-gray-700">
                        View and manage all your insurance form submissions
                    </p>
                </div>

                {forms.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No insurance forms found</h3>
                        <p className="text-gray-500 mb-6">You haven't submitted any insurance forms yet.</p>
                        <button
                            onClick={() => navigate('/insurance')}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Create New Form
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {forms.map((form) => (
                            <div key={form._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 truncate">{form.itemName}</h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {new Date(form.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-gray-500">Supplier</div>
                                            <div className="font-medium text-gray-900">{form.supplierName}</div>

                                            <div className="text-gray-500">Buyer</div>
                                            <div className="font-medium text-gray-900">{form.buyerName}</div>

                                            <div className="text-gray-500">Quantity</div>
                                            <div className="font-medium text-gray-900">{form.quantity}</div>

                                            <div className="text-gray-500">Rate</div>
                                            <div className="font-medium text-gray-900">₹{form.rate}</div>

                                            <div className="text-gray-500">Amount</div>
                                            <div className="font-bold text-[#4309ac]">₹{form.amount}</div>

                                            <div className="text-gray-500">Vehicle</div>
                                            <div className="font-medium text-gray-900">{form.vehicleNumber || 'N/A'}</div>

                                            <div className="text-gray-500">HSN</div>
                                            <div className="font-medium text-gray-900">{form.hsn || 'N/A'}</div>

                                            <div className="text-gray-500">Supply Place</div>
                                            <div className="font-medium text-gray-900">{form.placeOfSupply || 'N/A'}</div>
                                        </div>

                                        {form.notes && (
                                            <div className="mt-3">
                                                <div className="text-sm font-medium text-gray-500 mb-1">Notes</div>
                                                <p className="text-sm text-gray-700 bg-gray-300 p-2 rounded">{form.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {form.pdfURL && (
                                        <div className="mt-1 pt-2 border-t border-gray-100">
                                            <a
                                                href={`http://localhost:5000${form.pdfURL}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4309ac] opacity-80 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                View/Download PDF
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyInsuranceForms;