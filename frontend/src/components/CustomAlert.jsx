import React from 'react';
import './CustomAlert.css'; // Stylizacja dla modala

const CustomAlert = ({ message, onClose }) => {
    return (
        <div className="custom-alert-overlay">
            <div className="custom-alert">
                <h2>Wystąpił błąd</h2>
                <p>{message}</p>
                <button onClick={onClose}>Zamknij</button>
            </div>
        </div>
    );
};

export default CustomAlert;
