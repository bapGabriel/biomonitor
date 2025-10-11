import React from 'react';
import PatientSelection from '../partials/PatientSelection';
import Container from '../components/Container';
import Section from '../components/Section';

function SelectPatient() {
    return (
        <Container>
            <Section title={'Seleção de Pacientes'}>
                <PatientSelection />
            </Section>
        </Container>
    );
}

export default SelectPatient;
