import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowUpIcon, PaperClipIcon } from '@heroicons/react/24/outline';

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

    /* ========================= SUBMIT ========================= */
    const submitInsuranceForm = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        setMessages(prev => [
            ...prev,
            { text: 'Submitting insurance form and generating PDF…', sender: 'bot' },
        ]);

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
            if (weightmentSlip) submitData.append('weightmentSlip', weightmentSlip);

            const token = localStorage.getItem('token');
            if (!token) return navigate('/');

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
                { text: 'Insurance form submitted successfully ✅', sender: 'bot' },
            ]);

            if (response.data?.data?.pdfURL) {
                window.open(`http://localhost:5000${response.data.data.pdfURL}`, '_blank');
            }

            setTimeout(() => navigate('/home'), 3000);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    text: err.response?.data?.message || 'Submission failed. Please try again.',
                    sender: 'bot',
                },
            ]);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ========================= FLOW ========================= */
    const goToNextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setMessages(prev => [...prev, { text: questions[nextIndex].text, sender: 'bot' }]);

            if (questions[nextIndex].type === 'file') {
                setTimeout(() => fileInputRef.current?.click(), 300);
            }
        } else {
            submitInsuranceForm();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const q = questions[currentQuestionIndex];

        if (!q.optional && !inputValue.trim()) {
            setError('This field is required');
            return;
        }

        setError('');
        setFormData(prev => ({ ...prev, [q.field]: inputValue }));
        setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
        setInputValue('');
        goToNextQuestion();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setWeightmentSlip(file);
        setMessages(prev => [...prev, { text: `📎 ${file.name}`, sender: 'user' }]);
        await submitInsuranceForm();
    };

    const currentQuestion = questions[currentQuestionIndex];
    const isFileInput = currentQuestion.type === 'file';

    return (
        <div className="flex flex-col h-screen bg-[#efeae2]">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 shadow">
                <div className="w-9 h-9 rounded-full bg-gray-300" />
                <div>
                    <p className="font-medium leading-none">Insurance Assistant</p>
                    <p className="text-xs opacity-80">online</p>
                </div>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[75%] px-3 py-2 text-sm rounded-lg ${m.sender === 'user'
                                    ? 'bg-[#dcf8c6] rounded-br-none'
                                    : 'bg-white rounded-bl-none'
                                }`}
                        >
                            {m.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="bg-[#f0f0f0] px-3 py-2 border-t">
                {error && <p className="text-red-500 text-xs mb-1">{error}</p>}

                {isFileInput ? (
                    <div className="flex justify-center">
                        {!weightmentSlip ? (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-[#25D366] text-white px-4 py-2 rounded-full flex items-center gap-2"
                                >
                                    <PaperClipIcon className="w-4 h-4" />
                                    Upload weightment slip
                                </button>
                            </>
                        ) : (
                            <button
                                disabled
                                className="bg-gray-400 text-white px-6 py-2 rounded-full"
                            >
                                Submitting…
                            </button>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input
                            type={currentQuestion.type}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message"
                            className="flex-1 rounded-full px-4 py-2 text-sm focus:outline-none"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#25D366] p-2 rounded-full text-white"
                        >
                            <ArrowUpIcon className="w-5 h-5" />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Insurance;
