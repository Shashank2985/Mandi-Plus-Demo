import React from 'react';

const Select = ({ options, placeholder, value, onChange, className = '', ...props }) => {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`w-full px-3 py-2 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-[#4309ac] focus:border-transparent ${className}`}
            {...props}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;