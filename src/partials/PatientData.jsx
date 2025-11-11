import React from 'react';
import { useContext } from 'react';
import { FHIRContext } from '../context/FHIRProvider';

function PatientData() {
    const { selectedPatient } = useContext(FHIRContext);

    if (!selectedPatient) {
        return (
            <div className="p-6 max-w-md mx-auto">
                <span>Nenhum paciente selecionado.</span>
            </div>
        );
    }

    const name = selectedPatient.name?.[0];
    const given = name?.given?.join(' ') || '';
    const family = name?.family || '';
    const genderMap = {
        male: 'Masculino',
        female: 'Feminino',
        other: 'Outro',
        unknown: 'Desconhecido',
    };
    const gender = genderMap[selectedPatient.gender] || 'Desconhecido';
    const birthDate = new Date(selectedPatient.birthDate).toDateString() || 'Desconhecido';
    const address = selectedPatient.address?.[0];
    const addressString = address
        ? `${address.line?.join(', ')}, ${address.city || ''}, ${address.state || ''}, ${address.postalCode || ''}`
        : 'Desconhecido';

    const telecom = selectedPatient.telecom || null;
    const phone = telecom?.find((t) => t.system === 'phone')?.value || null;
    const email = telecom?.find((t) => t.system === 'email')?.value || null;

    return (
        <div className="p-6 max-w-md mx-auto">
            <div className="flex items-center mb-6">
                <img
                    className="w-24 h-24 rounded-full object-cover"
                    src={`https://robohash.org/${selectedPatient._id || 'biomonitor'}`}
                    alt="Avatar do paciente"
                />
                <div className="ml-6 space-y-1">
                    <h2 className="text-xl font-semibold">
                        {given} {family}
                    </h2>
                    <p className="text-gray-500">
                        Idade:{' '}
                        {birthDate
                            ? new Date().getFullYear() - new Date(birthDate).getFullYear()
                            : 'Desconhecida'}
                    </p>
                    <p className="text-gray-500">Gênero: {gender || 'Não informado'}</p>
                </div>
            </div>

            <dl className="grid grid-cols-1 gap-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">Data de Nascimento:</dt>
                    <dd>
                        {birthDate
                            ? new Date(birthDate).toLocaleDateString('pt-BR')
                            : 'Desconhecida'}
                    </dd>
                </div>
                <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">Endereço:</dt>
                    <dd>{addressString || '-'}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">Telefone:</dt>
                    <dd>{phone || '-'}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">Email:</dt>
                    <dd>{email || '-'}</dd>
                </div>
            </dl>
        </div>
    );
}

export default PatientData;
