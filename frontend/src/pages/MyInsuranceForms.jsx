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
                setError('Failed to load insurance forms');
                console.error('Fetch forms error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchForms();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Insurance Forms</h1>

                {forms.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600">No insurance forms submitted yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {forms.map((form) => (
                            <div key={form._id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">{form.itemName}</h3>
                                        <p><strong>Supplier:</strong> {form.supplierName}</p>
                                        <p><strong>Buyer:</strong> {form.buyerName}</p>
                                        <p><strong>Quantity:</strong> {form.quantity}</p>
                                        <p><strong>Rate:</strong> {form.rate}</p>
                                        <p><strong>Amount:</strong> ₹{form.amount}</p>
                                        <p><strong>Vehicle:</strong> {form.vehicleNumber}</p>
                                    </div>
                                    <div>
                                        <p><strong>HSN:</strong> {form.hsn}</p>
                                        <p><strong>Place of Supply:</strong> {form.placeOfSupply}</p>
                                        <p><strong>Submitted:</strong> {new Date(form.createdAt).toLocaleDateString()}</p>
                                        {form.notes && <p><strong>Notes:</strong> {form.notes}</p>}
                                        {form.pdfURL && (
                                            <a
                                                href={`http://localhost:5000/${form.pdfURL}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Download PDF
                                            </a>
                                        )}
                                    </div>
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