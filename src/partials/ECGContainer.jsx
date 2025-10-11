import React from 'react';
import { useState } from 'react';
import ECGDynamic from './ECGDynamic';
import ECGStatic from './ECGStatic';

function ECGContainer() {
    const [mode, setMode] = useState('dynamic');

    return (
        <div className="flex flex-col h-full w-full space-y-4">
            <div className="flex-1 w-full border rounded flex items-center justify-center p-4">
                {mode === 'dynamic' ? <ECGDynamic /> : <ECGStatic />}
            </div>

            <div className="flex space-x-2 w-full h-12">
                <button
                    onClick={() => setMode('dynamic')}
                    className={`flex-1 px-4 py-2 rounded ${
                        mode === 'dynamic'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Dinâmico
                </button>

                <button
                    onClick={() => setMode('static')}
                    className={`flex-1 px-4 py-2 rounded ${
                        mode === 'static'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Estático
                </button>
            </div>
        </div>
    );
}

export default ECGContainer;
