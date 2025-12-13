import React from 'react';

const Button = ({ children, onClick, disabled = false, className = '', type = 'button' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`bg-[#25D366] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#20c157] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;