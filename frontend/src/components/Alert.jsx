import React from 'react';
import './Alert.css'; // Stylizacja dla modala

const Alert = ({ message, onClose }) => {
    return (
        <div className="custom-alert-overlayy">
            <div className="custom-alertt">
                <h2>Wykonano pomyślnie</h2>
                <p>{message}</p>
                <button onClick={onClose}>Zamknij</button>
            </div>
        </div>
    );
};

export default Alert;
