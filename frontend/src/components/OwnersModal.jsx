import React, { useState } from "react";
import "./VehicleDetailsModal.css";

const OwnersModal = ({ owners = [], onClose, onUpdate }) => {
    const [ownersList, setOwnersList] = useState(owners);

    const handleAddOwner = () => {
        setOwnersList([
            ...ownersList,
            { imie: "", nazwisko: "", dataZakupu: "", dataSprzedazy: "" },
        ]);
    };

    const handleChange = (index, field, value) => {
        const updatedOwners = [...ownersList];
        updatedOwners[index][field] = value;
        setOwnersList(updatedOwners);
    };

    const handleRemoveOwner = (index) => {
        const updatedOwners = ownersList.filter((_, i) => i !== index);
        setOwnersList(updatedOwners);
    };

    const handleSaveAndClose = () => {
        onUpdate(ownersList); // Zapisanie aktualnych danych
        onClose(); // Zamknięcie okna
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Lista Właścicieli</h2>
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
                {ownersList.length === 0 ? (
                    <p className="no-data">Brak danych</p>
                ) : (ownersList.map((owner, index) => (
                    <div key={index} className="modal-form">
                        <label>
                            Imię:
                            <input
                                type="text"
                                value={owner.imie}
                                onChange={(e) =>
                                    handleChange(index, "imie", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Nazwisko:
                            <input
                                type="text"
                                value={owner.nazwisko}
                                onChange={(e) =>
                                    handleChange(index, "nazwisko", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Data Zakupu:
                            <input
                                type="date"
                                value={owner.dataZakupu}
                                onChange={(e) =>
                                    handleChange(index, "dataZakupu", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Data Sprzedaży:
                            <input
                                type="date"
                                value={owner.dataSprzedazy || ""}
                                onChange={(e) =>
                                    handleChange(index, "dataSprzedazy", e.target.value)
                                }
                            />
                        </label>
                        <button
                            className="remove-button"
                            onClick={() => handleRemoveOwner(index)}
                        >
                            Usuń
                        </button>
                    </div>
                )))}

                <div className="modal-buttons">
                    <button onClick={handleSaveAndClose}>Zapisz</button>
                    <button className="add-button" onClick={handleAddOwner}>
                        Dodaj Właściciela
                    </button>
                    <button onClick={onClose}>Zamknij</button>
                </div>
            </div>
        </div>
    );
};

export default OwnersModal;