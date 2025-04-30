import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const clientId = "biomonitor";
const redirectUri = `${window.location.origin}/callback`;
const scopes = "launch patient/*.rs openid fhirUser";

function Launch() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const iss = searchParams.get("iss") || import.meta.env.VITE_FHIR_API_URL;
        const launch = searchParams.get("launch");

        if (!iss) {
            console.error("Provedor de serviço FHIR não encontrado!");
            navigate("/error");
            return;
        }

        const wellKnown = axios.get(`${iss}/.well-known/smart-configuration`).then((res) => {
            sessionStorage.setItem("iss", iss);
            sessionStorage.setItem("launch", launch);
            sessionStorage.setItem("token_endpoint", res.data.token_endpoint);
    
            const authorizeUrl = new URL(res.data.authorization_endpoint);
            authorizeUrl.searchParams.set("redirect_uri", redirectUri);
            authorizeUrl.searchParams.set("scope", scopes);
            authorizeUrl.searchParams.set("token_endpoint", res.data.token_endpoint);
            authorizeUrl.searchParams.set("client_id", clientId);
            authorizeUrl.searchParams.set("state", Math.random().toString(36).substring(2));
            authorizeUrl.searchParams.set("aud", iss);
    
            window.location.href = authorizeUrl.toString();
        });
        
    }, [searchParams, navigate]);

    return <div>Inicializando...</div>;
}

export default Launch;
