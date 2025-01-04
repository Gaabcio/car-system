import React, { useState, useEffect } from "react";
import "./VehicleDetailsModal.css";
import CreatableSelect from "react-select/creatable";
import warsztatyData from "../data/warsztaty.json";

const customSelectStyles = {
    control: (base) => ({
        ...base,
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '4px',
        fontSize: '14px',
        boxShadow: 'none',
        '&:hover': {
            border: '1px solid #888',
        },
        marginTop: '8px',
    }),
    placeholder: (base) => ({
        ...base,
        color: '#999',
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? '#17a2b8' : state.isFocused ? '#f1f1f1' : '#fff',
        color: state.isSelected ? '#fff' : '#333',
        padding: '10px',
        fontSize: '14px',
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '8px',
        marginTop: '4px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    }),
    menuList: (base) => ({
        ...base,
        maxHeight: '150px', // Ograniczenie maksymalnej wysokości listy
        overflowY: 'auto',  // Dodanie przewijania w pionie
    }),
    singleValue: (base) => ({
        ...base,
        color: '#333',
    }),
};


const ServiceHistoryModal = ({ history = [], onClose, onUpdate }) => {
    const [serviceHistory, setServiceHistory] = useState(history);
    const [workshopOptions, setWorkshopOptions] = useState([]);


    useEffect(() => {
        fetch('http://localhost:5000/api/warsztaty')
            .then(response => response.json())
            .then(data => setWorkshopOptions(data))
            .catch(error => console.error('Error fetching workshop data:', error));
    }, []);

    const handleAddRecord = () => {
        setServiceHistory([
            ...serviceHistory,
            { data: "", opis: "", warsztat: "" },
        ]);
    };

    const findWorkshopDetails = (workshopName) => {
        return warsztatyData.find(workshop => workshop.nazwa === workshopName);
    };

    const handleChange = (index, field, value) => {
        const updatedHistory = [...serviceHistory];
        updatedHistory[index][field] = value;
        setServiceHistory(updatedHistory);
    };

    const handleRemoveRecord = (index) => {
        const updatedHistory = serviceHistory.filter((_, i) => i !== index);
        setServiceHistory(updatedHistory);
    };

    const handleSaveAndClose = () => {
        onUpdate(serviceHistory); // Zapisanie aktualnych danych
        onClose(); // Zamknięcie okna
    };

    return (
        
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Historia Serwisowa</h2>
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
                {serviceHistory.length === 0 ? (
                    <p className="no-data">Brak danych</p>
                ) : (serviceHistory.map((record, index) => {
                    const selectedWorkshop = findWorkshopDetails(record.warsztat);

                    return (
                        <div key={index} className="modal-form">
                            <label>
                                Data:
                                <input
                                    type="date"
                                    value={record.data}
                                    onChange={(e) =>
                                        handleChange(index, "data", e.target.value)
                                    }
                                />
                            </label>

                            <label>
                                <CreatableSelect
                                    value={record.warsztat ? { value: record.warsztat, label: record.warsztat } : null}
                                    onChange={(newValue) => handleChange(index, "warsztat", newValue ? newValue.label : '')}
                                    options={workshopOptions.map(workshop => ({ value: workshop.nazwa, label: workshop.nazwa }))}
                                    onCreateOption={(inputValue) => handleChange(index, "warsztat", inputValue)}
                                    placeholder="Wybierz lub dodaj warsztat"
                                    isClearable
                                    styles={customSelectStyles}
                                    formatCreateLabel={(inputValue) => ''}
                                    required
                                />
                            </label>

                            <label>
                                Opis:
                                <textarea
                                    value={record.opis}
                                    onChange={(e) =>
                                        handleChange(index, "opis", e.target.value)
                                    }
                                />
                            </label>

                            <label>
                                {selectedWorkshop && (
                                <div className="workshop-details">
                                    <h4>Dane wybranego warsztatu:</h4>
                                    <p><strong>Ulica:</strong> {selectedWorkshop.adres.ulica}</p>
                                    <p><strong>Miasto:</strong> {selectedWorkshop.adres.miasto}</p>
                                    <p><strong>Kod pocztowy:</strong> {selectedWorkshop.adres.kodPocztowy}</p>
                                    <p><strong>Telefon:</strong> {selectedWorkshop.telefon}</p>
                                </div>
                                )}
                            </label>
                            
                            <button
                                className="remove-button"
                                onClick={() => handleRemoveRecord(index)}
                            >
                                Usuń
                            </button>
                        </div>
                    );
                }))}

                <div className="modal-buttons">
                    <button onClick={handleSaveAndClose}>Zapisz</button>
                    <button className="add-button" onClick={handleAddRecord}>
                        Dodaj Rekord
                    </button>
                    <button onClick={onClose}>Zamknij</button>
                </div>
            </div>
        </div>
    );
};

export default ServiceHistoryModal;