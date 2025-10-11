import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { FHIRProvider } from './context/FHIRProvider.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <FHIRProvider>
                <App />
            </FHIRProvider>
        </BrowserRouter>
    </StrictMode>
);
