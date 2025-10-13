import React from 'react';
import { useContext } from 'react';
import { FHIRContext } from '../context/FHIRProvider';

function ECGDynamic() {
    const { selectedObservation } = useContext(FHIRContext);

    const sampledData = selectedObservation.component?.[0]?.valueSampledData;

    return (
        <div className="max-w-sm truncate">
            <div>
                <p>Período: {sampledData?.period ?? 'N/A'}</p>
                <p>Dados: {sampledData?.data ?? 'N/A'}</p>
            </div>

            <h2>Gráfico ECG Dinâmico</h2>
        </div>
    );
}

export default ECGDynamic;
