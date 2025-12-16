import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const KnowVehicle = () => {
    const navigate = useNavigate();

    const [messages, setMessages] = useState([
        {
            text: 'Please enter your vehicle number 🚗\nकृपया अपना वाहन नंबर दर्ज करें',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);

    const [inputValue, setInputValue] = useState('');
    const [showButtons, setShowButtons] = useState(false);
    const [hasResponded, setHasResponded] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || hasResponded) return;

        const userMessage = {
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setHasResponded(true);

        setTimeout(() => {
            const botResponses = [
                {
                    text: `Permit – Active  
परमिट – एक्टिव  

Driver License – Available  
ड्राइवर लाइसेंस – उपलब्ध  

Vehicle Condition – OK  
गाड़ी की स्थिति – ठीक  

Challan – No Challan Found  
चालान – कोई चालान नहीं  

EMI – Paid On Time  
ईएमआई – समय पर भुगतान  

Vehicle Fitness – Fit  
गाड़ी फिटनेस – फिट  

✅ You can take **MandiPlus Verified Vehicle**  
✅ आप **MandiPlus सत्यापित वाहन** ले सकते हैं`,
                    sender: 'bot',
                    timestamp: new Date()
                },
                {
                    text: `Want to see your vehicle? 🚚
क्या आप अपना वाहन देखना चाहते हैं?
Kya aap apna vehicle dekhna chahte hain?`,
                    sender: 'bot',
                    isQuestion: true,
                    timestamp: new Date()
                }
            ];

            setMessages(prev => [...prev, ...botResponses]);
            setShowButtons(true);
        }, 1000);
    };

    const renderMessageContent = (message) => {
        if (message.hasImage) {
            return (
                <img
                    src="/images/truck-image.jpg"
                    alt="Vehicle"
                    className="rounded-lg mt-2 max-w-60"
                />
            );
        }

        return message.text.split('\n').map((line, idx) => (
            <p key={idx} className="mb-1">{line}</p>
        ));
    };

    return (
        <div className="flex flex-col h-screen">

            {/* HEADER (UNCHANGED) */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center shadow">
                <button onClick={() => navigate('/home')} className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <div className="flex-1">
                    <p className="font-medium">Know Your Vehicle</p>
                    <p className="text-xs opacity-80">Mandi Plus</p>
                </div>
                <div className="flex gap-4">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
                        <path d="M3 6a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" />
                    </svg>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                </div>
            </div>

            {/* CHAT AREA */}
            <div
                className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
                style={{
                    backgroundImage: "url('/images/whatsapp-bg.png')",
                    backgroundRepeat: 'repeat',
                    backgroundColor: '#ECE5DD'
                }}
            >
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[90%] px-3 py-2 text-sm rounded-lg shadow-sm
                            ${message.sender === 'user'
                                    ? 'bg-[#DCF8C6] rounded-tr-none'
                                    : 'bg-white rounded-tl-none'}`}
                        >
                            <div className="text-gray-800">
                                {renderMessageContent(message)}

                                {message.isQuestion && showButtons && (
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            className="bg-[#25D366] text-white px-4 py-2 rounded-full text-sm"
                                            onClick={() => {
                                                setShowButtons(false);
                                                setMessages(prev => [
                                                    ...prev,
                                                    { text: "Here's your vehicle 🚚", sender: 'bot', timestamp: new Date() },
                                                    { hasImage: true, sender: 'bot', timestamp: new Date() }
                                                ]);
                                            }}
                                        >
                                            Yes / हाँ / Haan
                                        </button>
                                        <button
                                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm"
                                            onClick={() => setShowButtons(false)}
                                        >
                                            No / नहीं / Nahi
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="text-right mt-1 text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                {message.sender === 'user' && ' ✓✓'}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="bg-[#F0F0F0] px-3 py-2 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter vehicle number..."
                        className="flex-1 rounded-full px-4 py-2 text-sm focus:outline-none"
                        disabled={hasResponded}
                    />
                    <button
                        type="submit"
                        disabled={hasResponded}
                        className={`p-2 rounded-full ${hasResponded ? 'bg-gray-400' : 'bg-[#25D366]'}`}
                    >
                        <ArrowUpIcon className="h-5 w-5 text-white" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default KnowVehicle;
