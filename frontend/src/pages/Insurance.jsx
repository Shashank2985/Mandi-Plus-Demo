import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const questions = [
    { field: 'supplierName', text: "What is the supplier's name?", type: 'text' },
    { field: 'supplierAddress', text: "What is the supplier's address?", type: 'text' },
    { field: 'placeOfSupply', text: 'What is the place of supply?', type: 'text' },
    { field: 'buyerName', text: "What is the buyer's name?", type: 'text' },
    { field: 'buyerAddress', text: "What is the buyer's address?", type: 'text' },
    { field: 'itemName', text: 'What is the item name?', type: 'text' },
    { field: 'hsn', text: 'What is the HSN code?', type: 'text' },
    { field: 'quantity', text: 'What is the quantity?', type: 'number' },
    { field: 'rate', text: 'What is the rate?', type: 'number' },
    { field: 'vehicleNumber', text: 'What is the vehicle number?', type: 'text' },
    { field: 'notes', text: 'Any additional notes? (Optional)', type: 'text', optional: true },
    { field: 'weightmentSlip', text: 'Please upload the weightment slip (Optional)', type: 'file', optional: true },
];

const Insurance = () => {
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        { text: `Welcome! ${questions[0].text}`, sender: 'bot' },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    /* =========================
       CENTRAL SUBMIT FUNCTION
       ========================= */
    const submitInsuranceForm = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        setMessages(prev => [
            ...prev,
            { text: 'Submitting insurance form and generating PDF...', sender: 'bot' },
        ]);

        try {
            const submitData = new FormData();

            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            if (weightmentSlip) {
                submitData.append('weightmentSlip', weightmentSlip);
            }

            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/api/insurance/create',
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setMessages(prev => [
                ...prev,
                { text: 'Insurance form submitted successfully!', sender: 'bot' },
            ]);

            if (response.data?.data?.pdfURL) {
                window.open(
                    `http://localhost:5000${response.data.data.pdfURL}`,
                    '_blank'
                );
            }

            setTimeout(() => navigate('/home'), 3000);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    text:
                        err.response?.data?.message ||
                        'Submission failed. Please try again.',
                    sender: 'bot',
                },
            ]);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* =========================
       NEXT QUESTION
       ========================= */
    const goToNextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setMessages(prev => [
                ...prev,
                { text: questions[nextIndex].text, sender: 'bot' },
            ]);

            if (questions[nextIndex].type === 'file') {
                setTimeout(() => fileInputRef.current?.click(), 300);
            }
        } else {
            submitInsuranceForm();
        }
    };

    /* =========================
       TEXT ANSWER SUBMIT
       ========================= */
    const handleSubmit = (e) => {
        e.preventDefault();
        const q = questions[currentQuestionIndex];

        if (!q.optional && !inputValue.trim()) {
            setError('This field is required');
            return;
        }

        setError('');

        setFormData(prev => ({
            ...prev,
            [q.field]: inputValue,
        }));

        setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
        setInputValue('');
        goToNextQuestion();
    };

    /* =========================
       FILE UPLOAD HANDLER
       ========================= */
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setWeightmentSlip(file);

        setMessages(prev => [
            ...prev,
            { text: `Uploaded: ${file.name}`, sender: 'user' },
        ]);

        // LAST STEP → SUBMIT
        await submitInsuranceForm();
    };

    const currentQuestion = questions[currentQuestionIndex];
    const isFileInput = currentQuestion.type === 'file';

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 shadow">
                <h1 className="text-lg font-semibold">Insurance Assistant</h1>
                <p className="text-xs opacity-80">Chat-based insurance form</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`max-w-[75%] p-3 rounded-lg ${m.sender === 'user'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                }`}
                        >
                            {m.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                {isFileInput ? (
                    <div className="text-center">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Upload Weightment Slip
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex">
                        <input
                            type={currentQuestion.type}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={currentQuestion.text}
                            className="flex-1 border rounded-l px-3 py-2"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-4 rounded-r"
                        >
                            <ArrowUpIcon className="h-5 w-5" />
                        </button>
                    </form>
                )}

                {isSubmitting && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Processing…
                    </p>
                )}
            </div>
        </div>
    );
};

export default Insurance;
