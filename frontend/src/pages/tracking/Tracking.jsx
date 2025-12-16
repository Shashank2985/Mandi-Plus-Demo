import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const Tracking = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            text: 'Please enter your vehicle number to track your delivery 🚚',
            sender: 'bot'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = {
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Simulate bot response after a short delay
        setTimeout(() => {
            const botResponse = {
                text: '📍 Current Location: HSR Layout, Bangalore\n\nYour vehicle is currently near HSR Layout, Bangalore.',
                sender: 'bot',
                isLocation: true
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    const formatMessage = (text) => {
        if (!text) return null;

        // Split by newlines and map to paragraphs
        return text.split('\n').map((line, i) => (
            <p key={i} className="mb-1">{line}</p>
        ));
    };

    return (
        <div className="flex flex-col h-screen bg-[#efeae2]">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/home')}
                        className="text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div>
                        <p className="font-medium leading-none">Track Your Delivery</p>
                        <p className="text-xs opacity-80">Mandi Plus</p>
                    </div>
                </div>
                <a href="tel:" className="p-2 rounded-full hover:bg-[#128C7E] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                </a>
            </div>

            {/* Chat Container */}
            <div
                className="flex-1 bg-white overflow-y-auto px-4 py-3 space-y-3"
                style={{
                    backgroundImage: "url('/images/whatsapp-bg.png')",
                    backgroundRepeat: 'repeat',
                    width: '100%',
                    height: '100%',
                    opacity: 0.6,
                }}
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[75%] px-3 py-2 text-sm rounded-lg ${message.sender === 'user'
                                    ? 'bg-[#DCF8C6] rounded-br-none'
                                    : 'bg-white rounded-bl-none'
                                }`}
                        >
                            <div className="text-gray-800">
                                {formatMessage(message.text)}
                                {message.isLocation && (
                                    <a
                                        href="https://www.google.com/maps?q=HSR+Layout+Bangalore"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline block mt-1 text-sm"
                                    >
                                        View on Google Maps
                                    </a>
                                )}
                            </div>
                            <div className="text-right mt-0.5">
                                <span className="text-xs text-gray-500 opacity-70">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f0f0] px-3 py-2 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter vehicle number..."
                        className="flex-1 rounded-full px-4 py-2 text-sm focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-[#25D366] p-2 rounded-full text-white"
                    >
                        <ArrowUpIcon className="h-5 w-5 text-white" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Tracking;
