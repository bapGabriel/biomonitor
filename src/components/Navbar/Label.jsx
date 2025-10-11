import React from 'react';
import PropTypes from 'prop-types';

function Label({ children }) {
    return <span className="uppercase text-xs font-small">{children}</span>;
}

Label.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Label;
