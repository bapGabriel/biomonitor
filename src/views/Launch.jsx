import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';

const clientId = 'biomonitor';
const redirectUri = `${import.meta.env.VITE_APP_URL}/callback`;
const scopesPatient = 'launch patient/*.rs openid fhirUser';
const scopesPractitioner = 'launch user/*.crudsh openid fhirUser';

function Launch() {
    const [searchParams] = useSearchParams();
    const [patientLogin, setPatientLogin] = useState();
    const [practitionerLogin, setPractitionerLogin] = useState();

    useEffect(() => {
        const iss = searchParams.get('iss') || import.meta.env.VITE_FHIR_API_URL;
        const launch = searchParams.get('launch');

        if (!iss) {
            console.error('Provedor de serviço FHIR não encontrado!');
            navigate('/error');
            return;
        }

        axios.get(`${iss}/.well-known/smart-configuration`).then((res) => {
            console.log(iss);

            sessionStorage.setItem('iss', iss);
            sessionStorage.setItem('launch', launch);
            sessionStorage.setItem('token_endpoint', res.data.token_endpoint);

            const baseParams = {
                redirect_uri: redirectUri,
                token_endpoint: res.data.token_endpoint,
                client_id: clientId,
                state: Math.random().toString(36).substring(2),
                aud: iss,
            };

            const patientUrl = new URL(res.data.authorization_endpoint);
            Object.entries(baseParams).forEach(([k, v]) => patientUrl.searchParams.set(k, v));
            patientUrl.searchParams.set('scope', scopesPatient);
            setPatientLogin(patientUrl.toString());

            const practitionerUrl = new URL(res.data.authorization_endpoint);
            Object.entries(baseParams).forEach(([k, v]) => practitionerUrl.searchParams.set(k, v));
            practitionerUrl.searchParams.set('scope', scopesPractitioner);
            setPractitionerLogin(practitionerUrl.toString());
        });
    }, [searchParams]);

    return (
        <div className="flex flex-col gap-2 items-center">
            <span>Fazer login como...</span>
            <div className="flex gap-2">
                <a href={patientLogin}>
                    <Button>Paciente</Button>
                </a>
                <a href={practitionerLogin}>
                    <Button>Médico</Button>
                </a>
            </div>
        </div>
    );
}

export default Launch;
