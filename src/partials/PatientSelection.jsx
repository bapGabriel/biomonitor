import React from 'react';
import { useContext, useMemo } from 'react';
import { FHIRContext } from '../context/FHIRProvider';
import { v4 as uuidv4 } from 'uuid';
import SelectionList from '../components/SelectionList';

function PatientSelection() {
    const { patients, selectedPatient, setSelectedPatient } = useContext(FHIRContext);

    const patientsWithUID = useMemo(() => {
        if (!patients) return [];
        return patients.map((p) => ({ ...p, _frontId: p._id || uuidv4() }));
    }, [patients]);

    return (
        <>
            {patients ? (
                <SelectionList
                    items={patientsWithUID}
                    selectedItem={selectedPatient}
                    setSelectedItem={setSelectedPatient}
                    getItemLabel={(p) => {
                        if (p.name?.[0]?.text) return p.name[0].text;

                        const given = p.name?.[0]?.given?.join(' ') || '';
                        const family = p.name?.[0]?.family || '';

                        const fullName = [given, family].filter(Boolean).join(' ').trim();
                        return fullName || 'Paciente sem nome';
                    }}
                />
            ) : (
                <span>Carregando pacientes...</span>
            )}
        </>
    );
}

export default PatientSelection;
