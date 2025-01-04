import React, { useState } from "react";
import "./VehicleDetailsModal.css";
import ServiceHistoryModal from "./ServiceHistoryModal";
import OwnersModal from "./OwnersModal";
import InsuranceModal from "./InsuranceModal"; // Zaimportowanie komponentu ubezpieczenia
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import CustomAlert from './CustomAlert';
import Alert from './Alert';

const VehicleDetailsModal = ({ vehicle, onClose, onUpdate }) => {
    const [formData, setFormData] = useState(vehicle);
    const [showServiceHistoryModal, setShowServiceHistoryModal] = useState(false);
    const [showOwnersModal, setShowOwnersModal] = useState(false);
    const [showInsuranceModal, setShowInsuranceModal] = useState(false); // Dodanie stanu dla modalu ubezpieczenia
    const currentYear = new Date().getFullYear();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false); // Stan do kontrolowania wyświetlania alertu
    const [alertMessage, setAlertMessage] = useState(''); // Wiadomość do wyświetlenia w alercie

    const [showAlert2, setShowAlert2] = useState(false); // Stan do kontrolowania wyświetlania alertu
    const [alertMessage2, setAlertMessage2] = useState(''); // Wiadomość do wyświetlenia w alercie


    // Funkcja do zamknięcia alertu
    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value.replace(/^0+(?=\d)/, ""); // Usuń zerowe prefiksy

        // Walidacja dla odpowiednich pól
        if (name === "rokProdukcji") {
            // Rok produkcji nie może być większy niż bieżący rok lub mniejszy niż 0
            newValue = Math.max(0, Math.min(currentYear, parseInt(newValue) || 0)).toString();
        }

        if (name === "przebieg" || name === "pojemnoscSilnika" || name === "numerRejestracyjny") {
            // Przebieg i pojemność silnika muszą być liczbami >= 0
            newValue = Math.max(0, parseInt(newValue.replace(/\D/g, '')) || 0).toString();
        }

        if (name === "liczbaDrzwi") {
            // Liczba drzwi musi być liczbą całkowitą >= 0
            newValue = Math.max(0, parseInt(newValue) || 0).toString();
        }

        setFormData({ ...formData, [name]: newValue });
    };

    const handleDelete = async () => {
        console.log('Usuwanie pojazdu:', vehicle._id); // Dodaj log

        try {
            const response = await fetch(`http://localhost:5000/api/pojazdy/${vehicle._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Błąd podczas usuwania pojazdu');
            }

            console.log('Pojazd usunięty pomyślnie'); // Dodaj log
            setAlertMessage2('Pojazd został usunięty pomyślnie.');
            setShowAlert2(true);

            // Wywołaj funkcję aktualizującą dane w rodzicu
            if (onUpdate) {
                onUpdate(); // Odśwież listę pojazdów
            }

            // onClose(); // Zamknij modal po usunięciu pojazdu
            setTimeout(() => {
                onClose();
            }, 1000); // Zamknij modal po 1 sekundach
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Wystąpił błąd podczas usuwania pojazdu.');
            setShowAlert(true); // Wyświetl alert
        }
    };


    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/pojazdy/${vehicle._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Przekaż zaktualizowane dane
            });

            if (!response.ok) {
                throw new Error('Błąd podczas aktualizacji pojazdu');
            }

            const updatedVehicle = await response.json();
            onUpdate(updatedVehicle); // Przekaż zaktualizowane dane do rodzica
            setAlertMessage2('Dane pojazdu zostały zaktualizowane pomyślnie.');
            setShowAlert2(true);

            // Zamknij modal po 1 sekundach
            setTimeout(() => {
                onClose();
            }, 1000);
            // onClose(); // Zamknij modal
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Wystąpił błąd podczas aktualizacji pojazdu.');
            setShowAlert(true); // Wyświetl alert
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Szczegóły pojazdu</h2>
                    <div className="close" onClick={onClose}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <svg viewBox="0 0 36 36" className="circle">
                            <path
                                stroke-dasharray="100, 100"
                                d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                    </div>
                </div>
                <div className="modal-form">
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
                        Numer Rejestracyjny:
                        <input
                            type="text"
                            name="numerRejestracyjny"
                            value={formData.numerRejestracyjny}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Marka:
                        <input
                            type="text"
                            name="marka"
                            value={formData.marka}
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
                        Rodzaj Paliwa:
                        <input
                            type="text"
                            name="rodzajPaliwa"
                            value={formData.rodzajPaliwa}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Rok Produkcji:
                        <input
                            type="number"
                            name="rokProdukcji"
                            value={formData.rokProdukcji}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Typ:
                        <input
                            type="text"
                            name="typ"
                            value={formData.typ}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Liczba Drzwi:
                        <input
                            type="number"
                            name="liczbaDrzwi"
                            value={formData.liczbaDrzwi}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Kolor:
                        <input
                            type="text"
                            name="kolor"
                            value={formData.kolor}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Przebieg:
                        <input
                            type="text"
                            name="przebieg"
                            value={formData.przebieg}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Pojemność Silnika: (cm³)
                        <input
                            type="number"
                            name="pojemnoscSilnika"
                            value={formData.pojemnoscSilnika}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <button className="hbutton" onClick={() => setShowServiceHistoryModal(true)}>
                        Historia Serwisowa
                    </button>
                    <button className="hbutton" onClick={() => setShowOwnersModal(true)}>
                        Właściciele
                    </button>
                    {/* Dodanie przycisku do ubezpieczenia */}
                    <button className="hbutton" onClick={() => setShowInsuranceModal(true)}>
                        Ubezpieczenie
                    </button>
                </div>
                <div className="modal-buttons">
                    <button onClick={handleUpdate}>Zaktualizuj</button>
                    <button onClick={() => setShowDeleteModal(true)} className="cancel-button">
                        Usuń pojazd
                    </button>
                    <button onClick={onClose}>Zamknij</button>
                </div>
            </div>
            {showServiceHistoryModal && (
                <ServiceHistoryModal
                    history={formData.historiaSerwisowa}
                    onClose={() => setShowServiceHistoryModal(false)}
                    onUpdate={(updatedHistory) =>
                        setFormData({ ...formData, historiaSerwisowa: updatedHistory })
                    }
                />
            )}
            {showOwnersModal && (
                <OwnersModal
                    owners={formData.wlasciciele}
                    onClose={() => setShowOwnersModal(false)}
                    onUpdate={(updatedOwners) =>
                        setFormData({ ...formData, wlasciciele: updatedOwners })
                    }
                />
            )}
            {showInsuranceModal && (
                <InsuranceModal
                    insurance={formData.ubezpieczenie || {}}
                    onClose={() => setShowInsuranceModal(false)}
                    onUpdate={(updatedInsurance) =>
                        setFormData({ ...formData, ubezpieczenie: updatedInsurance })
                    }
                />
            )}
            {showDeleteModal && (
                <DeleteConfirmationModal vehicle={vehicle} onClose={() => setShowDeleteModal(false)} onDelete={handleDelete} />
            )}
            {/* Wyświetlenie alertu w przypadku błędu logowania */}
            {showAlert && <CustomAlert message={alertMessage} onClose={handleCloseAlert} />}

            {showAlert2 && <Alert message={alertMessage2} onClose={handleCloseAlert} />}

        </div>
    );
};

export default VehicleDetailsModal;
