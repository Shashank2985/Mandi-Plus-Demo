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
    const [submitting, setSubmitting] = useState(false);

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

    // 🔒 Backend submit logic
    const submitForm = async (data) => {
        try {
            setSubmitting(true);
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            await axios.post(
                "http://localhost:5000/api/insurance/create",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Form submitted successfully ✅" },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Submission failed ❌" },
            ]);
            console.error("Submit error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`px-4 py-2 rounded-lg max-w-[80%] ${
                                msg.sender === "user"
                                    ? "bg-blue-600 text-white ml-auto"
                                    : "bg-gray-200 text-gray-800"
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {typing && (
                        <div className="text-sm text-gray-500">Bot is typing...</div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type here..."
                        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={submitting}
                    />
                    <button
                        onClick={handleSend}
                        disabled={submitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsuranceChatForm;
