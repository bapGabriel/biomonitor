import React, { useContext, useState } from 'react';
import NewPatient from '../partials/NewPatient';
import EditPatient from '../partials/EditPatient';
import { FHIRContext } from '../context/FHIRProvider';

function Patient() {
    const [mode, setMode] = useState('new');
    const { selectedPatient } = useContext(FHIRContext);

    return (
        <div>
            <div className="flex space-x-2 w-full h-12">
                <button
                    onClick={() => setMode('new')}
                    className={`flex-1 px-4 py-2 rounded ${
                        mode === 'new'
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Criar
                </button>

                <button
                    onClick={() => setMode('edit')}
                    className={`flex-1 px-4 py-2 rounded ${
                        mode === 'edit'
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${!selectedPatient ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!selectedPatient}
                >
                    Alterar
                </button>
            </div>
            <div>{mode === 'new' ? <NewPatient /> : <EditPatient />}</div>
        </div>
    );
}

export default Patient;
