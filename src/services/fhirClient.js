import axios from 'axios';

const fhirClient = axios.create({
    baseURL: import.meta.env.VITE_FHIR_API_URL,
});

fhirClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default fhirClient;
