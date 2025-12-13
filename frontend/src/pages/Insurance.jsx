import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Paperclip } from "lucide-react";

const steps = [
  { key: "supplierName", label: "Supplier Name" },
  { key: "supplierAddress", label: "Supplier Address" },
  { key: "placeOfSupply", label: "Place of Supply" },
  { key: "buyerName", label: "Buyer Name" },
  { key: "buyerAddress", label: "Buyer Address" },
  { key: "itemName", label: "Item Name" },
  { key: "hsn", label: "HSN Code" },
  { key: "quantity", label: "Quantity" },
  { key: "rate", label: "Rate" },
  { key: "vehicleNumber", label: "Vehicle Number" },
  { key: "notes", label: "Notes (Optional)" },
  { key: "weightmentSlip", label: "Upload Weightment Slip" },
];

const InsuranceWhatsAppUI = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const [messages, setMessages] = useState([
    { sender: "bot", text: `Enter ${steps[0].label}` },
  ]);

  const [formData, setFormData] = useState({});
  const [weightmentSlip, setWeightmentSlip] = useState(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;

    /* Confirmation Logic */
    if (awaitingConfirmation) {
      setMessages((prev) => [...prev, { sender: "user", text: input }]);

      if (input === "1") {
        submitForm();
      } else if (input === "2") {
        setWeightmentSlip(null);
        submitForm();
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Invalid input. Type 1 or 2." },
        ]);
      }

      setInput("");
      return;
    }

    const current = steps[step];
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setFormData((prev) => ({ ...prev, [current.key]: input }));
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      if (step + 1 < steps.length) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `Enter ${steps[step + 1].label}` },
        ]);
        setStep(step + 1);
      }
    }, 500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setWeightmentSlip(file);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `📎 ${file.name}` },
      {
        sender: "bot",
        text:
          "Weightment slip uploaded.\n\nType:\n1️⃣ Submit Insurance Form\n2️⃣ Skip upload & Submit\n\n(You can also re-upload using 📎)",
      },
    ]);

    setAwaitingConfirmation(true);
  };

  // 🔒 BACKEND LOGIC — AS IS
  const submitForm = async () => {
    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      if (weightmentSlip) data.append("weightmentSlip", weightmentSlip);

      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      const response = await axios.post(
        "http://localhost:5000/api/insurance/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Insurance submitted successfully." },
      ]);

      if (response.data.data?.pdfURL) {
        window.open(
          `http://localhost:5000${response.data.data.pdfURL}`,
          "_blank"
        );
      }

      setTimeout(() => navigate("/home"), 2500);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Submission failed. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex md:items-center md:justify-center">
      <div className="flex flex-col w-full md:max-w-md md:h-[90vh] bg-[#efeae2] md:rounded-xl">

        {/* Header */}
        <div className="bg-[#075e54] text-white px-4 py-3">
          <h2 className="font-semibold">Insurance Assistant</h2>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 max-w-[80%] text-sm rounded-lg shadow ${
                  msg.sender === "user"
                    ? "bg-[#dcf8c6] rounded-br-none"
                    : "bg-white rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white p-3 border-t flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current.click()}
            className="text-gray-500"
          >
            <Paperclip size={20} />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
          />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
            disabled={loading}
          />

          <button
            onClick={handleSend}
            className="bg-green-500 text-white px-4 py-2 rounded-full text-sm"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceWhatsAppUI;
