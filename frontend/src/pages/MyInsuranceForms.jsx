import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const steps = [
    { key: "supplierName", label: "Supplier Name" },
    { key: "buyerName", label: "Buyer Name" },
    { key: "quantity", label: "Quantity" },
    { key: "rate", label: "Rate" },
    { key: "amount", label: "Amount" },
    { key: "vehicleNumber", label: "Vehicle Number" },
];

const InsuranceChatForm = () => {
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    const [currentStep, setCurrentStep] = useState(0);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [formData, setFormData] = useState({});
    const [messages, setMessages] = useState([
        { sender: "bot", text: `Enter ${steps[0].label}` },
    ]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    const handleSend = () => {
        if (!input.trim()) return;

        const step = steps[currentStep];

        setMessages((prev) => [...prev, { sender: "user", text: input }]);

        const updatedFormData = {
            ...formData,
            [step.key]: input,
        };

        setFormData(updatedFormData);
        setInput("");
        setTyping(true);

        setTimeout(() => {
            setTyping(false);

            if (currentStep + 1 < steps.length) {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: "bot",
                        text: `Enter ${steps[currentStep + 1].label}`,
                    },
                ]);
                setCurrentStep((prev) => prev + 1);
            } else {
                submitForm(updatedFormData);
            }
        }, 600);
    };

    // 🔒 Backend logic unchanged
    const submitForm = async (data) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
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
                                            href={`http://localhost:5000${form.pdfURL}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline inline-block mt-2 px-4 py-2 bg-blue-50 rounded hover:bg-blue-100"
                                        >
                                            View/Download PDF
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

export default InsuranceChatForm;
