import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Insurance = () => {
    const [formData, setFormData] = useState({
        supplierName: '',
        supplierAddress: '',
        placeOfSupply: '',
        buyerName: '',
        buyerAddress: '',
        itemName: '',
        hsn: '',
        quantity: '',
        rate: '',
        vehicleNumber: '',
        notes: '',
    });
    const [weightmentSlip, setWeightmentSlip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setWeightmentSlip(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const submitData = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            // Append weightment slip if exists
            if (weightmentSlip) {
                submitData.append('weightmentSlip', weightmentSlip);
            }

            // Get token
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            // Submit to backend
            const response = await axios.post('http://localhost:5000/api/insurance/create', submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Insurance form submitted successfully! PDF is being generated...');

            // Redirect to view the generated PDF
            if (response.data.data.pdfURL) {
                window.open(`http://localhost:5000${response.data.data.pdfURL}`, '_blank');
            }

            // Navigate back to home after a delay
            setTimeout(() => navigate('/home'), 3000);
        } catch (error) {
            console.error('Submission error:', error);
            setMessage(error.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Insurance Form</h1>

                {message && (
                    <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Supplier Name</label>
                            <input
                                type="text"
                                name="supplierName"
                                value={formData.supplierName}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Supplier Address</label>
                            <input
                                type="text"
                                name="supplierAddress"
                                value={formData.supplierAddress}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Place of Supply</label>
                            <input
                                type="text"
                                name="placeOfSupply"
                                value={formData.placeOfSupply}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Buyer Name</label>
                            <input
                                type="text"
                                name="buyerName"
                                value={formData.buyerName}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Buyer Address</label>
                            <input
                                type="text"
                                name="buyerAddress"
                                value={formData.buyerAddress}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Item Name</label>
                            <input
                                type="text"
                                name="itemName"
                                value={formData.itemName}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">HSN</label>
                            <input
                                type="text"
                                name="hsn"
                                value={formData.hsn}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Rate</label>
                            <input
                                type="number"
                                name="rate"
                                value={formData.rate}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                            <input
                                type="text"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            rows="3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Weightment Slip (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Submitting...' : 'Submit Insurance Form'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Insurance;