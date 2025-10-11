import React from 'react';
import { useContext } from 'react';
import { FHIRContext } from '../context/FHIRProvider';

function PatientData() {
    const { selectedPatient } = useContext(FHIRContext);

    if (!selectedPatient) {
        return <p>Nenhum paciente selecionado.</p>;
    }

    const name = selectedPatient.name?.[0];
    const given = name?.given?.join(' ') || '';
    const family = name?.family || '';
    const gender = selectedPatient.gender || 'Desconhecido';
    const birthDate = selectedPatient.birthDate || 'Desconhecido';
    const address = selectedPatient.address?.[0];
    const addressString = address
        ? `${address.line?.join(', ')}, ${address.city || ''}, ${address.state || ''}, ${address.postalCode || ''}`
        : 'Desconhecido';
    const telecom = selectedPatient.telecom?.[0];
    const phone = telecom?.system === 'phone' ? telecom.value : 'Desconhecido';
    const email = telecom?.system === 'email' ? telecom.value : 'Desconhecido';

    return (
        <div>
            <h1 className="text-xl font-bold mb-2">Dados do Paciente</h1>
            <div className="flex items-center mb-4">
                <div>
                    <img
                        className="w-24 h-24 object-cover"
                        src={`https://robohash.org/${selectedPatient.id || 'biomonitor'}`}
                        alt="Avatar do paciente"
                    />
                </div>
                <div className="ml-4">
                    <p>
                        Nome: {given} {family}
                    </p>
                    <p>
                        Idade:{' '}
                        {birthDate
                            ? new Date().getFullYear() - new Date(birthDate).getFullYear()
                            : 'Desconhecida'}
                    </p>
                    <p>Gênero: {gender}</p>
                </div>
            </div>

            <p>Data de Nascimento: {birthDate}</p>
            <p>Endereço: {addressString}</p>
            <p>Telefone: {phone}</p>
            <p>Email: {email}</p>
        </div>
    );
}

export default PatientData;
