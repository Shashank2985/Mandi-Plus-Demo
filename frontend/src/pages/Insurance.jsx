import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowUpIcon,
  PaperClipIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

/* ========================= QUESTIONS ========================= */

const QUESTIONS = {
  en: [
    {
      field: 'supplierCombined',
      text:
        "Please enter Supplier Name, Supplier Address, and Place of Supply (comma separated).",
      type: 'text',
    },
    { field: 'buyerName', text: "What is the buyer's name?", type: 'text' },
    { field: 'buyerAddress', text: "What is the buyer's address?", type: 'text' },
    { field: 'quantity', text: 'What is the quantity?', type: 'number' },
    { field: 'rate', text: 'What is the price?', type: 'number' },
    { field: 'vehicleNumber', text: 'What is the vehicle number?', type: 'text' },
    {
      field: 'notes',
      text: 'Any additional notes? (Optional)',
      type: 'text',
      optional: true,
    },
    {
      field: 'weightmentSlip',
      text: 'Please upload the weightment slip (Optional)',
      type: 'file',
      optional: true,
    },
  ],
  hi: [
    {
      field: 'supplierCombined',
      text:
        'कृपया सप्लायर का नाम, पता और सप्लाई की जगह (कॉमा से अलग करके) दर्ज करें।',
      type: 'text',
    },
    { field: 'buyerName', text: 'खरीदार का नाम क्या है?', type: 'text' },
    { field: 'buyerAddress', text: 'खरीदार का पता क्या है?', type: 'text' },
    { field: 'quantity', text: 'मात्रा कितनी है?', type: 'number' },
    { field: 'rate', text: 'कुल कीमत क्या है?', type: 'number' },
    { field: 'vehicleNumber', text: 'वाहन नंबर क्या है?', type: 'text' },
    {
      field: 'notes',
      text: 'कोई अतिरिक्त जानकारी? (वैकल्पिक)',
      type: 'text',
      optional: true,
    },
    {
      field: 'weightmentSlip',
      text: 'वजन पर्ची अपलोड करें (वैकल्पिक)',
      type: 'file',
      optional: true,
    },
  ],
};

const Insurance = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [language, setLanguage] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [weightmentSlip, setWeightmentSlip] = useState(null);

  const [formData, setFormData] = useState({
    supplierName: '',
    supplierAddress: '',
    placeOfSupply: '',
    buyerName: '',
    buyerAddress: '',
    quantity: '',
    rate: '',
    vehicleNumber: '',
    notes: '',
  });

  /* ========================= AUTO SCROLL ========================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ========================= LANGUAGE INIT ========================= */
  const selectLanguage = (lang) => {
    setLanguage(lang);
    setMessages([
      {
        text:
          lang === 'hi'
            ? 'भाषा चुनी गई है। शुरू करते हैं।'
            : 'Language selected. Let’s get started.',
        sender: 'bot',
      },
      { text: QUESTIONS[lang][0].text, sender: 'bot' },
    ]);
  };

  const questions = language ? QUESTIONS[language] : [];
  const currentQuestion = questions[currentQuestionIndex];
  const isFileInput = currentQuestion?.type === 'file';

  /* ========================= SUBMIT ========================= */
  const submitInsuranceForm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    setMessages((prev) => [
      ...prev,
      {
        text:
          language === 'hi'
            ? 'फॉर्म सबमिट किया जा रहा है…'
            : 'Submitting form and generating PDF…',
        sender: 'bot',
      },
    ]);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) =>
        submitData.append(key, formData[key])
      );
      if (weightmentSlip)
        submitData.append('weightmentSlip', weightmentSlip);

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

      setMessages((prev) => [
        ...prev,
        {
          text:
            language === 'hi'
              ? 'फॉर्म सफलतापूर्वक सबमिट हो गया ✅'
              : 'Form submitted successfully ✅',
          sender: 'bot',
        },
      ]);

      if (response.data?.data?.pdfURL) {
        window.open(
          `http://localhost:5000${response.data.data.pdfURL}`,
          '_blank'
        );
      }

      setTimeout(() => navigate('/home'), 3000);
    } catch (err) {
      setMessages((prev) => [
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

  /* ========================= FLOW ========================= */
  const goToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setMessages((prev) => [
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentQuestion.optional && !inputValue.trim()) {
      setError('This field is required');
      return;
    }

    setError('');
    setMessages((prev) => [...prev, { text: inputValue, sender: 'user' }]);

    if (currentQuestion.field === 'supplierCombined') {
      const [name, address, place] = inputValue.split(',').map((s) => s.trim());
      setFormData((prev) => ({
        ...prev,
        supplierName: name || '',
        supplierAddress: address || '',
        placeOfSupply: place || '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [currentQuestion.field]: inputValue,
      }));
    }

    setInputValue('');
    goToNextQuestion();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setWeightmentSlip(file);
    setMessages((prev) => [
      ...prev,
      { text: `📎 ${file.name}`, sender: 'user' },
    ]);
    submitInsuranceForm();
  };

  /* ========================= UI ========================= */
  return (
    <div className="flex flex-col h-screen bg-[#efeae2]">
      {/* Header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex justify-between items-center shadow">
        <div>
          <p className="font-medium leading-none">Mandi Plus</p>
          <p className="text-xs opacity-80">online</p>
        </div>
        <button onClick={() => window.open('tel:9999999999')}>
          <PhoneIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {!language && (
          <div className="flex gap-4">
            <button
              onClick={() => selectLanguage('en')}
              className="bg-[#25D366] text-white px-4 py-2 rounded-full"
            >
              English
            </button>
            <button
              onClick={() => selectLanguage('hi')}
              className="bg-[#25D366] text-white px-4 py-2 rounded-full"
            >
              हिंदी
            </button>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 text-sm rounded-lg ${
                m.sender === 'user'
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

      {/* Input */}
      {language && (
        <div className="bg-[#f0f0f0] px-3 py-2 border-t">
          {error && <p className="text-red-500 text-xs mb-1">{error}</p>}
          {isFileInput ? (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#25D366] text-white px-4 py-2 rounded-full flex gap-2"
              >
                <PaperClipIcon className="w-4 h-4" />
                Upload
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 rounded-full px-4 py-2 text-sm"
                placeholder={
                  language === 'hi' ? 'मैसेज टाइप करें' : 'Type a message'
                }
              />
              <button className="bg-[#25D366] p-2 rounded-full text-white">
                <ArrowUpIcon className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Insurance;
