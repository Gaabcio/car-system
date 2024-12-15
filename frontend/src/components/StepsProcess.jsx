// frontend/src/components/StepsProcess.jsx
import React from 'react';
import './StepsProcess.css';

const StepsProcess = () => {
    return (
        <div className="steps-process-container">
            <h2 className="steps-title">Jak to działa?</h2>
            <div className="steps-cards">
                <div className="step-card">
                    <div className="icon-wrapper">
                        <ion-icon name="person-add-outline"></ion-icon>
                    </div>
                    <p>Tworzenie konta</p>
                </div>
                <div className="arrow">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>
                <div className="step-card zmiana">
                    <div className="icon-wrapper">
                        <ion-icon name="document-text-outline"></ion-icon>
                    </div>
                    <p>Wprowadzenie podstawowych informacji</p>
                </div>
                <div className="arrow">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>
                <div className="step-card">
                    <div className="icon-wrapper">
                        <ion-icon name="key-outline"></ion-icon>
                    </div>
                    <p>Wprowadzenie danych</p>
                </div>
                <div className="arrow">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>
                <div className="step-card">
                    <div className="icon-wrapper">
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                    </div>
                    <p>Zatwierdzenie</p>
                </div>
            </div>
        </div>
    );
};

export default StepsProcess;
