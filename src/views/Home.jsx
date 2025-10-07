import ECGContainer from "../partials/ECGContainer";
import PatientData from "../partials/PatientData";
import PatientSelection from "../partials/PatientSelection";
import ObservationSelection from "../partials/ObservationSelection";

function Home() {
    return (
        <div className="container mx-auto p-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 p-4 border rounded-xl shadow">
                    <ECGContainer />
                </div>
                <div className="col-span-1 p-4 border rounded-xl shadow">
                    <PatientData />
                </div>
                <div className="col-span-2 p-4 border rounded-xl shadow">
                    <ObservationSelection />
                </div>
                <div className="col-span-1 p-4 border rounded-xl shadow">
                    <PatientSelection />
                </div>
            </div>
        </div>
    )
}

export default Home;