import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowUpIcon, PaperClipIcon } from '@heroicons/react/24/outline';

const questions = [
    {
        field: 'language',
        type: 'language',
        text: {
            en: "Namaste! Select your language / नमस्ते! अपनी भाषा चुनें\nType 1 - English\nType 2 - हिंदी",
            hi: "Namaste! Select your language / नमस्ते! अपनी भाषा चुनें\nType 1 - English\nType 2 - हिंदी"
        }
    },
    {
        field: 'supplierName',
        type: 'text',
        text: {
            en: "Who is sending the goods? (Supplier Name)",
            hi: "माल भेजने वाली पार्टी का नाम क्या है?"
        }
    },
    {
        field: 'supplierAddress',
        type: 'text',
        text: {
            en: "Where are they from? (Supplier Address)",
            hi: "सप्लायर का एड्रेस कहाँ का है?"
        }
    },
    {
        field: 'placeOfSupply',
        type: 'text',
        text: {
            en: "Where does the delivery go? (Place of Supply)",
            hi: "माल कहाँ पहुँचाना है?"
        }
    },
    {
        field: 'buyerName',
        type: 'text',
        text: {
            en: "Who is buying? (Buyer Party Name)",
            hi: "माल खरीदने वाली पार्टी का नाम क्या है?"
        }
    },
    {
        field: 'buyerAddress',
        type: 'text',
        text: {
            en: "What is the Buyer's address?",
            hi: "खरीदने वाली पार्टी का एड्रेस बताइये।"
        }
    },
    {
        field: 'itemName',
        type: 'text',
        text: {
            en: "What is the item? (e.g., Rice, Wheat)",
            hi: "माल में क्या आइटम है? (जैसे - चावल, गेहूं)"
        }
    },
    {
        field: 'hsn',
        type: 'text',
        text: {
            en: "Do you know the HSN code?",
            hi: "अगर HSN कोड पता है तो बता दीजिये।"
        }
    },
    {
        field: 'quantity',
        type: 'number',
        text: {
            en: "How much quantity/weight?",
            hi: "कितना माल है?"
        }
    },
    {
        field: 'rate',
        type: 'number',
        text: {
            en: "What is the rate/price?",
            hi: "क्या भाव लगा है?"
        }
    },
    {
        field: 'vehicleNumber',
        type: 'text',
        text: {
            en: "What is the vehicle number?",
            hi: "गाड़ी नंबर क्या है?"
        }
    },
    {
        field: 'notes',
        type: 'text',
        optional: true,
        text: {
            en: "Any other details? (Optional)",
            hi: "कोई और खास बात या नोट? (वैकल्पिक)"
        }
    },
    {
        field: 'weightmentSlip',
        type: 'file',
        optional: true,
        text: {
            en: "Upload the Weightment Slip (Kanta Parchi)",
            hi: "कांटा पर्ची की फोटो भेजें (वैकल्पिक)"
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
        itemName: 'Tender Coconut',
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
    // FIX 1: Accept 'fileArgument' directly so we don't depend on stale state
    const submitInsuranceForm = async (fileArgument = null) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        setMessages(prev => [
            ...prev,
            { text: 'Submitting insurance form and generating PDF…', sender: 'bot' },
        ]);

        try {
            const submitData = new FormData();

            // Append text fields
            Object.keys(formData).forEach(key => submitData.append(key, formData[key]));

            // FIX 2: Use the passed file argument OR the state (fallback)
            const finalFile = fileArgument || weightmentSlip;
            if (finalFile) {
                submitData.append('weightmentSlip', finalFile);
            }

            const token = localStorage.getItem('token');
            if (!token) return navigate('/');

            const response = await axios.post(
                'http://localhost:5000/api/insurance/create',
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Content-Type is handled automatically by axios for FormData
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
                { text: 'Tender Coconut', sender: 'user' },
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

        // Update state (for UI display if needed later)
        setWeightmentSlip(file);

        setMessages(prev => [...prev, { text: `📎 ${file.name}`, sender: 'user' }]);

        setMessages(prev => [
            ...prev,
            {
                text: language === 'hi'
                    ? 'सबमिट किया जा रहा है...'
                    : 'Submitting...',
                sender: 'bot'
            }
        ]);

        // FIX 3: Pass 'file' directly here!
        // Because 'setWeightmentSlip' is async, state won't be ready yet.
        await submitInsuranceForm(file);
    };

    const currentQuestion = questions[currentQuestionIndex];
    const isFileInput = currentQuestion.type === 'file';

    return (
        <div className="flex flex-col h-screen bg-[#efeae2]">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/home')}
                        className="p-1 -ml-2 rounded-full hover:bg-[#128C7E] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
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
            <div className="flex-1 bg-white overflow-y-auto px-4 py-3 space-y-3"
                style={{
                    backgroundImage: "url('/images/whatsapp-bg.png')",
                    backgroundRepeat: 'repeat',
                    width: '100%',
                    height: '100%',
                    opacity: 0.6,
                }}
            >
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