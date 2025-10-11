import React from 'react';
import PropTypes from 'prop-types';

function Section({ children, title }) {
    return (
        <div className="border rounded">
            <div className="bg-gray-300 p-2 text-xl font-bold mb-2"> {title}</div>
            <div className="p-2">{children}</div>
        </div>
    );
}

Section.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
};

export default Section;
