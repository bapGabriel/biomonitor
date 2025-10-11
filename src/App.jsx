import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Callback from './views/Callback';
import Launch from './views/Launch';
import Navbar from './partials/Navbar';
import SelectPatient from './views/SelectPatient';

function App() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <Navbar />
            <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-center">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/callback" element={<Callback />} />
                    <Route path="/launch" element={<Launch />} />
                    <Route path="/patients/search" element={<SelectPatient />} />
                    <Route path="/patients/new" element={<SelectPatient />} />
                    <Route path="/observation/new" element={<SelectPatient />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
