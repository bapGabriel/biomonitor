import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

function SelectionList({ items, selectedItem, setSelectedItem, getItemLabel }) {
    const [query, setQuery] = useState('');

    const filteredItems = items.filter((item) => {
        const label = getItemLabel(item) || '';
        return label.toLowerCase().includes(query.toLowerCase());
    });

    return (
        <div>
            <Input
                type="text"
                placeholder="Buscar..."
                value={query}
                onChange={setQuery}
                className="mb-2"
            />

            <ul className="max-h-48 overflow-y-auto">
                {filteredItems.map((item) => {
                    const label = getItemLabel(item);
                    return (
                        <li
                            key={item._frontId}
                            onClick={() => setSelectedItem(item)}
                            className={`cursor-pointer px-4 py-2 rounded mb-1 transition-colors
              ${selectedItem?._frontId === item._frontId ? 'bg-cyan-500 text-white' : 'hover:bg-cyan-100'}`}
                        >
                            {label}
                        </li>
                    );
                })}
                {filteredItems.length === 0 && (
                    <li className="text-gray-400 px-4 py-2 italic">Nenhum resultado</li>
                )}
            </ul>
        </div>
    );
}

SelectionList.propTypes = {
    items: PropTypes.array.isRequired,
    selectedItem: PropTypes.object,
    setSelectedItem: PropTypes.func.isRequired,
    getItemLabel: PropTypes.func.isRequired,
};

export default SelectionList;
