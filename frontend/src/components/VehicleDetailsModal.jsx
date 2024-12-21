import React, { useState } from "react";
import "./VehicleDetailsModal.css";

const VehicleDetailsModal = ({ vehicle, onClose, onUpdate }) => {
    const [formData, setFormData] = useState(vehicle);

    // Pobierz bieżący rok
    const currentYear = new Date().getFullYear();

    // Funkcja do formatowania przebiegu
    const formatMileage = (value) => {
        // Usuń wszystkie nie-cyfry, oprócz spacji
        const cleanedValue = value.replace(/\D/g, '');

        // Dodaj spacje co 3 cyfry
        return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Usuń zerowe prefiksy, pozostawiając jedno zero, jeśli wartość to "0"
        let newValue = value.replace(/^0+(?=\d)/, "");

        // Walidacja wartości
        if (name === "year") {
            // Rok musi być większy od 0 i nie większy niż bieżący rok
            newValue = Math.max(0, Math.min(currentYear, parseInt(newValue) || 0)).toString();
        }

        if (name === "mileage") {
            // Przebieg nie może być ujemny, usuwamy zera na początku
            newValue = Math.max(0, parseInt(newValue.replace(/\D/g, '')) || 0).toString();
            newValue = formatMileage(newValue);
        }

        setFormData({ ...formData, [name]: newValue });
    };

    const handleUpdate = () => {
        onUpdate(formData);
        onClose(); // Zamknij okno po aktualizacji
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Szczegóły pojazdu</h2>
                <div className="modal-form">
                    <label>
                        Marka:
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Model:
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        VIN:
                        <input
                            type="text"
                            name="vin"
                            value={formData.vin}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Rok produkcji:
                        <input
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Przebieg:
                        <input
                            type="text" // Zmieniono na text, by obsługiwać formatowanie
                            name="mileage"
                            pattern="\d*" // Pozwala tylko na cyfry
                            value={formData.mileage}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="modal-buttons">
                    <button onClick={handleUpdate}>Zaktualizuj</button>
                    <button onClick={onClose}>Zamknij</button>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsModal;
