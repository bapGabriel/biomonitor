import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
    const navigate = useNavigate();

    useEffect(() => {
        const alreadyCalled = sessionStorage.getItem('token_requested');
        if (alreadyCalled == 'true') return;

        sessionStorage.setItem('token_requested', 'true');

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        console.log('CODE:', code);
        console.log('ORIGIN:', import.meta.env.VITE_APP_URL);

        const token_endpoint = sessionStorage.getItem('token_endpoint');

        if (code) {
            axios
                .post(token_endpoint, {
                    grant_type: 'authorization_code',
                    scope: 'patient/*.rs',
                    redirect_uri: `${import.meta.env.VITE_APP_URL}/callback`,
                    code: code,
                    client_id: 'biomonitor',
                })
                .then((response) => {
                    sessionStorage.setItem('access_token', response.data.access_token);
                    navigate('/');
                })
                .catch((error) => {
                    console.error('Erro adquirindo token.', error);
                });
        }
    }, [navigate]);

    return <div>Finalizando login...</div>;
}

export default Callback;
