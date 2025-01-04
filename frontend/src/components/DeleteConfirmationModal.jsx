import React, { useState, useEffect } from "react";
import "./DeleteConfirmationModal.css"; // Dodaj stylizację do modalu

const DeleteConfirmationModal = ({ vehicle, onClose, onDelete }) => {
    const [generatedCode, setGeneratedCode] = useState(null);
    const [userCode, setUserCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Generowanie 6-cyfrowej liczby przy załadowaniu komponentu
    useEffect(() => {
        const code = Math.floor(100000 + Math.random() * 900000); // Generuje 6-cyfrową liczbę
        setGeneratedCode(code);
    }, []);

    const handleInputChange = (e) => {
        setUserCode(e.target.value);
    };

    const handleConfirmDelete = () => {
        if (userCode === generatedCode.toString()) {
            onDelete(); // Wywołanie funkcji usuwania pojazdu
            onClose(); // Zamknięcie modalu
        } else {
            setErrorMessage("Wprowadzony kod jest niepoprawny. Spróbuj ponownie.");
        }
    };

    return (
        <div className="delete-confirmation-overlay">
            <div className="delete-confirmation-modal">
                <h2>Potwierdź usunięcie pojazdu</h2>
                <p>Wpisz poniższy kod, aby potwierdzić usunięcie pojazdu:</p>
                <div className="code-display">
                    <strong>{generatedCode}</strong>
                </div>
                <input
                    type="text"
                    placeholder="Wpisz kod"
                    value={userCode}
                    onChange={handleInputChange}
                    maxLength={6}
                />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="modal-buttons">
                    <button onClick={handleConfirmDelete}>Potwierdź</button>
                    <button onClick={onClose}>Anuluj</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
