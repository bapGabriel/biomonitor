import React, { useContext, useEffect } from 'react';
import Container from '../components/Container';
import Section from '../components/Section';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import { FHIRContext } from '../context/FHIRProvider';
import { jwtDecode } from 'jwt-decode';
import fhirClient from '../services/fhirClient';
import { useNavigate } from 'react-router-dom';
import PatientSelection from './PatientSelection';

function EditPatient() {
    const { token, selectedPatient, setPatients } = useContext(FHIRContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedPatient) return;

        const telecom = Array.isArray(selectedPatient.telecom)
            ? selectedPatient.telecom
            : selectedPatient.telecom
              ? [selectedPatient.telecom]
              : [];

        const phone = telecom.find((t) => t.system === 'phone')?.value || '';
        const email = telecom.find((t) => t.system === 'email')?.value || '';

        const address = Array.isArray(selectedPatient.address)
            ? selectedPatient.address[0]
            : selectedPatient.address || {};

        const name = Array.isArray(selectedPatient.name)
            ? selectedPatient.name[0]
            : selectedPatient.name || {};

        const given = Array.isArray(name.given) ? name.given.join(' ') : '';

        const birthDate = selectedPatient.birthDate ? selectedPatient.birthDate.split('T')[0] : '';

        reset({
            names: given || '',
            lastName: name.family || '',
            gender: selectedPatient.gender || '',
            birthDate,
            line: address.line?.[0] || '',
            city: address.city || '',
            state: address.state || '',
            phone,
            email,
        });
    }, [selectedPatient, reset]);

    const onSubmit = async (data) => {
        const decoded = jwtDecode(token);
        const fhirUser = decoded.fhirUser ?? null;
        if (!fhirUser) return;

        const practitionerReference = fhirUser.replace(/^.+\/(Practitioner\/[A-Za-z0-9]+)$/, '$1');

        let fhirObject = {
            resourceType: 'Patient',
            identifier: [
                {
                    system: 'IF4Health',
                },
            ],
            name: [
                {
                    use: 'official',
                    family: data.lastName,
                    given: data.names ? data.names.trim().split(/\s+/) : [],
                },
            ],
            gender: data.gender || undefined,
            birthDate: data.birthDate || undefined,
            address:
                data.line || data.city
                    ? [
                          {
                              use: 'home',
                              line: data.line ? [data.line] : [],
                              city: data.city || undefined,
                              state: data.state || undefined,
                          },
                      ]
                    : undefined,
            telecom: [
                data.phone ? { system: 'phone', value: data.phone, use: 'mobile' } : null,
                data.email ? { system: 'email', value: data.email, use: 'home' } : null,
            ].filter(Boolean),

            generalPractitioner: [
                {
                    reference: practitionerReference,
                },
            ],
        };

        try {
            const res = await fhirClient.put(`/Patient/${selectedPatient._id}`, fhirObject);
            fhirClient
                .get(`/Patient`)
                .then((res) => setPatients(res.data.entry?.map((e) => e.resource)) || [])
                .catch((err) => console.error('Error fetching patients:', err));
            navigate('/patients/search');
        } catch (error) {
            console.error('Erro: ', error);
        }
    };

    return (
        <Container>
            <Section title={'Editar Paciente'}>
                <PatientSelection willRedirect={false} />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex gap-2 w-full">
                        <div className="flex flex-col flex-1">
                            <label className="text-xs ml-4" htmlFor="names">
                                Nome:
                            </label>
                            <input
                                className="bg-gray-100 py-2 px-4 rounded-xl"
                                id="names"
                                type="text"
                                {...register('names', { required: 'Nome é obrigatório.' })}
                            />
                            {errors.names && (
                                <span className="text-red-500 text-sm">{errors.names.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col flex-1">
                            <label className="text-xs ml-4" htmlFor="lastName">
                                Sobrenome:
                            </label>
                            <input
                                className="bg-gray-100 py-2 px-4 rounded-xl"
                                id="lastName"
                                type="text"
                                {...register('lastName', { required: 'Sobrenome é obrigatório.' })}
                            />
                            {errors.lastName && (
                                <span className="text-red-500 text-sm">
                                    {errors.lastName.message}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs ml-4" htmlFor="gender">
                            Gênero:
                        </label>
                        <select
                            className="bg-gray-100 py-2 px-4 rounded-xl"
                            id="gender"
                            {...register('gender', { required: 'Selecione o gênero.' })}
                        >
                            <option value="">Selecione...</option>
                            <option value="male">Masculino</option>
                            <option value="female">Feminino</option>
                            <option value="other">Outro</option>
                            <option value="unknown">Desconhecido</option>
                        </select>
                        {errors.gender && (
                            <span className="text-red-500 text-sm">{errors.gender.message}</span>
                        )}
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs ml-4" htmlFor="birthDate">
                            Data de Nascimento:
                        </label>
                        <input
                            className="bg-gray-100 py-2 px-4 rounded-xl"
                            id="birthDate"
                            type="date"
                            {...register('birthDate', {
                                required: 'Data de nascimento é obrigatória.',
                            })}
                        />
                        {errors.birthDate && (
                            <span className="text-red-500 text-sm">{errors.birthDate.message}</span>
                        )}
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs ml-4" htmlFor="line">
                            Endereço:
                        </label>
                        <input
                            className="bg-gray-100 py-2 px-4 rounded-xl"
                            id="line"
                            type="text"
                            {...register('line')}
                            placeholder="Rua, número..."
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs ml-4" htmlFor="city">
                            Cidade:
                        </label>
                        <input
                            className="bg-gray-100 py-2 px-4 rounded-xl"
                            id="city"
                            type="text"
                            {...register('city')}
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs ml-4" htmlFor="state">
                            Estado:
                        </label>
                        <input
                            className="bg-gray-100 py-2 px-4 rounded-xl"
                            id="state"
                            type="text"
                            {...register('state')}
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs ml-4" htmlFor="phone">
                            Telefone:
                        </label>
                        <input
                            className="bg-gray-100 py-2 px-4 rounded-xl"
                            id="phone"
                            type="tel"
                            {...register('phone')}
                            placeholder="(xx) xxxxx-xxxx"
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs ml-4" htmlFor="email">
                            E-mail:
                        </label>
                        <input
                            className="bg-gray-100 py-2 px-4 rounded-xl"
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="exemplo@email.com"
                        />
                    </div>

                    <Button type="">Cadastrar</Button>
                </form>
            </Section>
        </Container>
    );
}

export default EditPatient;
