import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowUpIcon, PaperClipIcon } from '@heroicons/react/24/outline';

const questions = [
    {
        field: 'language',
        type: 'language',
        text: {
            en: "Hi, Select language / भाषा चुने\nType 1 - English\nType 2 - हिंदी",
            hi: "Hi, Select language / भाषा चुने\nType 1 - English\nType 2 - हिंदी"
        }
    },
    {
        field: 'supplierName',
        type: 'text',
        text: {
            en: "What is the supplier's name?",
            hi: "सप्लायर का नाम क्या है?"
        }
    },
    {
        field: 'supplierAddress',
        type: 'text',
        text: {
            en: "What is the supplier's address?",
            hi: "सप्लायर का पता क्या है?"
        }
    },
    {
        field: 'placeOfSupply',
        type: 'text',
        text: {
            en: 'What is the place of supply?',
            hi: 'सप्लाय का स्थान क्या है?'
        }
    },
    {
        field: 'buyerName',
        type: 'text',
        text: {
            en: "What is the buyer's name?",
            hi: "खरीदार का नाम क्या है?"
        }
    },
    {
        field: 'buyerAddress',
        type: 'text',
        text: {
            en: "What is the buyer's address?",
            hi: "खरीदार का पता क्या है?"
        }
    },
    {
        field: 'itemName',
        type: 'text',
        text: {
            en: 'What is the item name?',
            hi: 'वस्तु का नाम क्या है?'
        }
    },
    {
        field: 'hsn',
        type: 'text',
        text: {
            en: 'What is the HSN code?',
            hi: 'HSN कोड क्या है?'
        }
    },
    {
        field: 'quantity',
        type: 'number',
        text: {
            en: 'What is the quantity?',
            hi: 'मात्रा क्या है?'
        }
    },
    {
        field: 'rate',
        type: 'number',
        text: {
            en: 'What is the rate?',
            hi: 'भाव क्या है?'
        }
    },
    {
        field: 'vehicleNumber',
        type: 'text',
        text: {
            en: 'What is the vehicle number?',
            hi: 'गाड़ी नंबर क्या है?'
        }
    },
    {
        field: 'notes',
        type: 'text',
        optional: true,
        text: {
            en: 'Any additional notes? (Optional)',
            hi: 'कोई अतिरिक्त नोट? (वैकल्पिक)'
        }
    },
    {
        field: 'weightmentSlip',
        type: 'file',
        optional: true,
        text: {
            en: 'Please upload the weightment slip (Optional)',
            hi: 'कृपया वजन पर्ची अपलोड करें (वैकल्पिक)'
        }
    },
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
        itemName: 'Coconut',
        hsn: '08011910',
        quantity: '',
        rate: '',
        vehicleNumber: '',
        notes: '',
    });

    const [weightmentSlip, setWeightmentSlip] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [language, setLanguage] = useState(null);
    const [messages, setMessages] = useState([
        { text: questions[0].text.en, sender: 'bot' },
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
    const getQuestionText = (question) => {
        return language ? question.text[language] : question.text.en;
    };

    const goToNextQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];

        // Skip itemName and hsn questions as they have default values
        let nextIndex = currentQuestionIndex + 1;
        if (currentQuestion.field === 'buyerAddress') {
            // After buyerAddress, skip to quantity
            nextIndex = questions.findIndex(q => q.field === 'quantity');

            // Add auto-filled values to messages
            setMessages(prev => [
                ...prev,
                { text: 'Coconut', sender: 'user' },
                { text: getQuestionText(questions[questions.findIndex(q => q.field === 'hsn')]), sender: 'bot' },
                { text: '08011910', sender: 'user' }
            ]);
        }

        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            const nextQuestion = questions[nextIndex];
            setMessages(prev => [...prev, {
                text: getQuestionText(nextQuestion),
                sender: 'bot'
            }]);

            if (nextQuestion.type === 'file') {
                setTimeout(() => fileInputRef.current?.click(), 300);
            }
        } else {
            submitInsuranceForm();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const q = questions[currentQuestionIndex];
        const currentInput = inputValue.trim();

        // Handle language selection
        if (q.field === 'language') {
            if (currentInput === '1' || currentInput === '2') {
                const selectedLanguage = currentInput === '1' ? 'en' : 'hi';
                const languageName = selectedLanguage === 'en' ? 'English' : 'हिंदी';

                // Update the language and messages in a single state update
                setLanguage(selectedLanguage);
                setMessages(prev => [
                    ...prev,
                    { text: languageName, sender: 'user' },
                    {
                        text: questions[1].text[selectedLanguage],
                        sender: 'bot'
                    }
                ]);
                setInputValue('');
                setCurrentQuestionIndex(1);
                return;
            } else {
                setError('Please type 1 or 2 / कृपया 1 या 2 टाइप करें');
                return;
            }
        }

        if (!q.optional && !currentInput) {
            setError(language === 'hi' ? 'यह फ़ील्ड आवश्यक है' : 'This field is required');
            return;
        }

        setError('');
        setFormData(prev => ({ ...prev, [q.field]: currentInput }));
        setMessages(prev => [...prev, { text: currentInput, sender: 'user' }]);
        setInputValue('');
        goToNextQuestion();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setWeightmentSlip(file);
        setMessages(prev => [...prev, { text: `📎 ${file.name}`, sender: 'user' }]);

        // Show submitting message in selected language
        setMessages(prev => [
            ...prev,
            {
                text: language === 'hi'
                    ? 'सबमिट किया जा रहा है...'
                    : 'Submitting...',
                sender: 'bot'
            }
        ]);

        await submitInsuranceForm();
    };

    const currentQuestion = questions[currentQuestionIndex];
    const isFileInput = currentQuestion.type === 'file';

    return (
        <div className="flex flex-col h-screen bg-[#efeae2]">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-300" />
                    <div>
                        <p className="font-medium leading-none">Mandi Plus</p>
                        <p className="text-xs opacity-80">online</p>
                    </div>
                </div>
                <a href="tel:" className="p-2 rounded-full hover:bg-[#128C7E] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                </a>
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
                                    {language === 'hi' ? 'वजन पर्ची अपलोड करें' : 'Upload weightment slip'}
                                </button>
                            </>
                        ) : (
                            <button
                                className="bg-[#25D366] text-white px-4 py-2 rounded-full flex items-center gap-2 opacity-50 cursor-not-allowed"
                                disabled
                            >
                                {language === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting...'}
                            </button>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input
                            type={currentQuestion.type}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={currentQuestion.type === 'number'
                                ? (language === 'hi' ? 'संख्या दर्ज करें...' : 'Enter a number...')
                                : (language === 'hi' ? 'अपना उत्तर टाइप करें...' : 'Type your answer...')}
                            className="flex-1 rounded-full px-4 py-2 text-sm focus:outline-none"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#25D366] p-2 rounded-full text-white"
                        >
                            <ArrowUpIcon className="h-5 w-5 text-white" />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Insurance;
