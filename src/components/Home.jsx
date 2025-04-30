import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

function Home() {
    const { request, loading, error } = useAxios();
    const [observation, setObservation] = useState("null");

    useEffect(() => {
        const iss = sessionStorage.getItem("iss");
        const token = sessionStorage.getItem("access_token");
        sessionStorage.setItem("token_requested", "false");

        if (iss && token) {
            request('get', `/Observation/67ec3319c34593d448c048cc/data/1`)
                .then(data => {
                    setObservation(data);
                })
        }
    }, [])

    return (
        <div>
            <h1>Home</h1>
            <div>
                {loading ? "Obtendo dados..." : (
                    <div>
                        {observation && Array.isArray(observation) && observation.length > 0 ? (
                            <div>
                                <p><strong>Code:</strong> {observation[0].code}</p>
                                <p><strong>Period:</strong> {observation[0].period}</p>
                                <p><strong>Data:</strong> {observation[0].data}</p>
                            </div>
                        ) : (
                            <p>...</p>
                        )}
                    </div>
                )}
                {error && <p style={{ color: "red" }}>Erro: {error.message}</p>}
            </div>
        </div>
    )
}

export default Home;