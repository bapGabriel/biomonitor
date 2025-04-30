import { useState } from 'react';
import axios from 'axios';

export default function useAxios() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = async (method, url, data = null, config = {}) => {
        setLoading(true);
        setError(null);

        try {
            const token = sessionStorage.getItem('access_token');

            const finalConfig = {
                method,
                url: sessionStorage.getItem('iss') + url,
                data,
                ...config,
                headers: {
                    ...(config.headers || {}),
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios(finalConfig);
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { request, loading, error };
}