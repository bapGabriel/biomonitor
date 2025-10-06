import { createContext, useState, useEffect, use } from "react";
import fhirClient from "../services/fhirClient";
import { jwtDecode } from "jwt-decode";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

const FHIRContext = createContext();

function FHIRProvider({ children }) {
    const [patients, setPatients] = useState(null);
    const [observations, setObservations] = useState({});
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedObservation, setSelectedObservation] = useState(null);
    const [token, setToken] = useState();
    const [loadingToken, setLoadingToken] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedToken = sessionStorage.getItem("access_token");

        const isLaunchOrCallback =
            matchPath({ path: "/launch", end: false }, location.pathname) ||
            matchPath({ path: "/callback", end: false }, location.pathname);

        if (!storedToken && !isLaunchOrCallback) {
            navigate("/launch");
        } else if (storedToken) {
            setToken(storedToken);
            setLoadingToken(false);
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        if (!token) return;

        const decoded = jwtDecode(token);
        const fhirUser = decoded.fhirUser ?? null;
        if (!fhirUser) return;

        const practitionerReference = fhirUser.replace(/^.+\/(Practitioner\/[A-Za-z0-9]+)$/, "$1");

        fhirClient
            .get(`/Patient?general-practitioner=${practitionerReference}`)
            .then(res => setPatients(res.data.entry?.map(e => e.resource)) || [])
            .catch(err => console.error("Error fetching patients:", err));
    }, [token]);

    useEffect(() => {
        if (selectedPatient) {
            loadObservations(selectedPatient._id);
            setSelectedObservation(null);
        }
    }, [selectedPatient]);


    async function loadObservations(patientId) {
        if (!token || observations[patientId]) return;
        
        try {
            const res = await fhirClient.get(`/Observation?patient=Patient/${patientId}`);
            setObservations(prev => ({ ...prev, [patientId]: res.data.entry?.map(e => e.resource) || [] }));
        } catch (err) {
            console.error("Error fetching observations:", err);
        }
    }

    return (
        <FHIRContext.Provider
            value={{
                patients,
                observations,
                selectedPatient,
                setSelectedPatient,
                setSelectedObservation,
                selectedObservation,
                token,
                loadingToken,
                loadObservations
            }}
        >
            {children}
        </FHIRContext.Provider>
    );
}

export { FHIRContext, FHIRProvider };