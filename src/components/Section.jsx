import React from 'react';
import PropTypes from 'prop-types';

function Section({ children, title }) {
    return (
        <div className="border rounded-xl">
            <div className="bg-gray-200 px-2 py-4 text-xl font-bold my-2"> {title}</div>
            <div className="p-2">{children}</div>
        </div>
    );
}

Section.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
};

export default Section;
