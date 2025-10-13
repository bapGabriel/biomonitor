import React from 'react';
import { useContext, useMemo } from 'react';
import { FHIRContext } from '../context/FHIRProvider';
import { v4 as uuidv4 } from 'uuid';
import SelectionList from '../components/SelectionList';

function ObservationSelection() {
    const { selectedPatient, observations, selectedObservation, setSelectedObservation } =
        useContext(FHIRContext);

    const obsWithUID = useMemo(() => {
        if (!selectedPatient || !observations?.[selectedPatient._id]) return [];
        return observations[selectedPatient._id].map((o) => ({
            ...o,
            _frontId: o._id || uuidv4(),
        }));
    }, [selectedPatient, observations]);

    if (!selectedPatient) return <p>Selecione um paciente primeiro.</p>;
    if (!obsWithUID.length) return <p>Nenhuma observação disponível.</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Seleção de Observação</h2>
            <SelectionList
                items={obsWithUID}
                selectedItem={selectedObservation}
                setSelectedItem={setSelectedObservation}
                getItemLabel={(o) => {
                    const display = o.code?.coding?.[0]?.display;
                    if (display) return display;

                    const code = o.code?.coding?.[0]?.code;
                    if (code) return code;

                    const text = o.code?.text;
                    if (text) return text;

                    return o.id ? `Observação ${o.id}` : 'Observação sem código';
                }}
                getItemId={(o) => o._frontId}
            />
        </div>
    );
}

export default ObservationSelection;
