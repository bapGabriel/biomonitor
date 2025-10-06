import { useContext, useMemo } from "react";
import { FHIRContext } from "../context/FHIRProvider";
import { v4 as uuidv4 } from "uuid";
import SelectionList from "../components/SelectionList";


function PatientSelection() {
  const { patients, selectedPatient, setSelectedPatient } = useContext(FHIRContext);

  const patientsWithUID = useMemo(() => {
    if (!patients) return [];
    return patients.map((p) => ({ ...p, _frontId: uuidv4() }));
  }, [patients]);

  if (!patients) return <p>Loading patients...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Seleção de Paciente</h2>
      <SelectionList
        items={patientsWithUID}
        selectedItem={selectedPatient}
        setSelectedItem={setSelectedPatient}
        getItemLabel={(p) => p.name?.[0]?.text || "Paciente sem nome"}
      />
    </div>
  );
}

export default PatientSelection;
