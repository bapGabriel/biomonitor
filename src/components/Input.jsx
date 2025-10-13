import React from 'react';
import PropTypes from 'prop-types';

function Input({ type = 'text', value, onChange, placeholder = '', className = '', ...props }) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-2 border border-gray-300 rounded hover:shadow transition-shadow 
        focus:outline-none focus:ring-2 focus:ring-cyan-500 ${className}`}
            {...props}
        />
    );
}

Input.propTypes = {
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

export default Input;
