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
        { sender: "bot", text: "Form submitted successfully." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Submission failed. Please try again." },
      ]);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex md:items-center md:justify-center">
      {/* Chat Container */}
      <div className="flex flex-col w-full md:max-w-md md:h-[90vh] bg-[#efeae2] md:rounded-xl md:shadow-xl">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#075e54] text-white px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="font-semibold text-base">Insurance Assistant</h1>
            <p className="text-xs opacity-80">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <span className="text-xs opacity-80">Online</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 text-sm rounded-lg shadow
                ${
                  msg.sender === "user"
                    ? "bg-[#dcf8c6] rounded-br-none"
                    : "bg-white rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-2 rounded-lg text-xs shadow animate-pulse">
                typing...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-white p-3 flex gap-2 border-t">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your answer..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 active:scale-95 transition"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default InsuranceChatForm;
