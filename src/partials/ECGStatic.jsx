import React, { useEffect, useState, useContext } from 'react';
import { FHIRContext } from '../context/FHIRProvider';
import CanvasJSReact from '@canvasjs/react-charts';
import fhirClient from '../services/fhirClient';

const { CanvasJSChart } = CanvasJSReact;

function ECGStatic() {
    const { selectedObservation } = useContext(FHIRContext);
    const [dataPoints, setDataPoints] = useState([]);
    const [minutes, setMinutes] = useState([]);
    const [chart, setChart] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentMinute, setCurrentMinute] = useState(null);
    const [preloadedMinute, setPreloadedMinute] = useState(null);

    const sampledData = selectedObservation?.component?.[0]?.valueSampledData;
    const samplesPerPageFromPeriod = (periodMs) => Math.floor((1000 / periodMs) * 10);

    useEffect(() => {
        if (!sampledData) return;

        const period = parseFloat(sampledData.period);
        const raw = sampledData.data.trim().split(/\s+/).map(Number);
        const samples = raw.map((v, i) => ({ x: i * period, y: v }));

        const minuteObj = {
            minuteNumber: 1,
            period,
            samples,
            sampleCount: samples.length,
        };

        setMinutes([minuteObj]);
        setCurrentMinute(1);
        setCurrentPage(0);
        setPreloadedMinute(null);
    }, [selectedObservation]);

    useEffect(() => {
        if (!minutes.length || currentMinute === null) return;

        const period = minutes[0].period;
        const samplesPerPage = samplesPerPageFromPeriod(period);

        let concat = [];
        let offset = 0;
        for (const m of minutes) {
            const shifted = m.samples.map((s, i) => ({
                x: offset + i * m.period,
                y: s.y,
            }));
            concat = concat.concat(shifted);
            offset += m.sampleCount * m.period;
        }

        const totalPages = Math.ceil(concat.length / samplesPerPage);
        const clampedPage = Math.max(0, Math.min(currentPage, totalPages - 1));
        if (clampedPage !== currentPage) setCurrentPage(clampedPage);

        const start = clampedPage * samplesPerPage;
        const end = start + samplesPerPage;
        setDataPoints(concat.slice(start, end));

        const totalMinutes = minutes.length;
        const lastMinute = minutes[totalMinutes - 1];
        const lastMinutePages = Math.ceil(lastMinute.sampleCount / samplesPerPage);
        const globalPageOfLastMinuteStart =
            Math.floor(
                minutes.slice(0, totalMinutes - 1).reduce((acc, m) => acc + m.sampleCount, 0) /
                    samplesPerPage
            ) +
            lastMinutePages -
            2;

        if (currentPage >= globalPageOfLastMinuteStart && preloadedMinute === null) {
            prefetchMinute(lastMinute.minuteNumber + 1);
        }
    }, [minutes, currentPage]);

    useEffect(() => {
        if (chart && dataPoints.length > 0) chart.render();
    }, [chart, dataPoints]);

    const fetchMinute = async (minuteNumber, { prepend = false } = {}) => {
        try {
            const res = await fhirClient.get(
                `/Observation/${selectedObservation.id}/data/${minuteNumber}`
            );
            const newSampled = Array.isArray(res.data)
                ? res.data[0]
                : (res.data.component?.[0]?.valueSampledData ?? res.data);

            const period = parseFloat(newSampled.period);
            const raw = newSampled.data.trim().split(/\s+/).map(Number);
            const samples = raw.map((v, i) => ({ x: i * period, y: v }));

            const minuteObj = {
                minuteNumber,
                period,
                samples,
                sampleCount: samples.length,
            };

            setMinutes((prev) => (prepend ? [minuteObj, ...prev] : [...prev, minuteObj]));

            const spp = samplesPerPageFromPeriod(period);
            const pagesInMinute = Math.ceil(samples.length / spp);

            if (prepend) {
                setCurrentPage((p) => p + pagesInMinute);
                setCurrentMinute(minuteNumber);
            } else {
                const prevSamples = minutes.reduce((acc, m) => acc + m.sampleCount, 0);
                const newPageIndex = Math.floor(prevSamples / spp);
                setCurrentPage(newPageIndex);
                setCurrentMinute(minuteNumber);
            }

            if (!prepend) setPreloadedMinute(null);
        } catch (err) {
            if (err.status === 500) return;
            console.error('Error fetching minute:', err);
        }
    };

    const prefetchMinute = async (minuteNumber) => {
        try {
            const res = await fhirClient.get(
                `/Observation/${selectedObservation.id}/data/${minuteNumber}`
            );
            const newSampled = Array.isArray(res.data)
                ? res.data[0]
                : (res.data.component?.[0]?.valueSampledData ?? res.data);

            const period = parseFloat(newSampled.period);
            const raw = newSampled.data.trim().split(/\s+/).map(Number);
            const samples = raw.map((v, i) => ({ x: i * period, y: v }));

            setPreloadedMinute({
                minuteNumber,
                period,
                samples,
                sampleCount: samples.length,
            });
        } catch (err) {
            if (err.status === 500) return;
            console.error('Error prefetching minute:', err);
        }
    };

    const handleNext = () => {
        const period = minutes[0]?.period;
        if (!period) return;
        const spp = samplesPerPageFromPeriod(period);
        const totalPages = Math.ceil(minutes.reduce((acc, m) => acc + m.sampleCount, 0) / spp);

        if (currentPage < totalPages - 1) {
            setCurrentPage((p) => p + 1);
        } else if (preloadedMinute) {
            setMinutes((prev) => [...prev, preloadedMinute]);
            setCurrentMinute(preloadedMinute.minuteNumber);
            setPreloadedMinute(null);
        } else {
            const lastMinute = minutes[minutes.length - 1].minuteNumber;
            fetchMinute(lastMinute + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage((p) => p - 1);
        } else {
            const firstMinute = minutes[0].minuteNumber;
            if (firstMinute > 1) {
                fetchMinute(firstMinute - 1, { prepend: true });
            }
        }
    };

    const pageDurationMs = 10000;
    const minorSpacing = 40;
    const majorSpacing = 200;
    const currentPageStartMs = currentPage * pageDurationMs;

    const options = {
        theme: 'light2',
        title: { text: `Página ${currentPage + 1}` },
        axisX: {
            minimum: currentPageStartMs,
            maximum: currentPageStartMs + pageDurationMs,
            gridThickness: 0,
            lineThickness: 2,
            labelFormatter: (e) => (e.value / 1000).toFixed(1) + 's',
            stripLines: [
                ...Array.from({ length: Math.ceil(pageDurationMs / minorSpacing) + 1 }, (_, i) => ({
                    value: currentPageStartMs + i * minorSpacing,
                    color: '#ffcccc',
                    thickness: 0.5,
                })),
                ...Array.from({ length: Math.ceil(pageDurationMs / majorSpacing) + 1 }, (_, i) => ({
                    value: currentPageStartMs + i * majorSpacing,
                    color: '#ff8080',
                    thickness: 1.5,
                })),
            ],
        },
        axisY: {
            gridThickness: 0,
            lineThickness: 2,
            minimum: sampledData?.lowerLimit,
            maximum: sampledData?.upperLimit,
            labelFormatter() {
                return '';
            },
        },
        data: [
            {
                type: 'line',
                lineThickness: 2,
                color: '#000000',
                dataPoints,
            },
        ],
    };

    return (
        <div className="w-full h-full">
            {selectedObservation && (
                <>
                    <CanvasJSChart options={options} onRef={(ref) => setChart(ref)} />
                    <div className="flex gap-8 mt-4">
                        <button
                            onClick={handlePrev}
                            className="flex-1 px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-400 active:bg-cyan-300"
                        >
                            ←
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-400 active:bg-cyan-300"
                        >
                            →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ECGStatic;
