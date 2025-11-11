import React from 'react';
function Button({ children }) {
    return (
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-cyan-500">
            {children}
        </button>
    );
}

export default Button;
