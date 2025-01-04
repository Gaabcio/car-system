import React, { useState, useEffect } from "react";
import "./VehicleDetailsModal.css";
import CreatableSelect from "react-select/creatable";

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

const InsuranceModal = ({ insurance = [], onClose, onUpdate }) => {
    const [insuranceData, setInsuranceData] = useState(insurance);
    const [insurers, setInsurers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/ubezpieczenia')
            .then(response => response.json())
            .then(data => setInsurers(data))
            .catch(error => console.error('Error fetching insurers:', error));
    }, []);

    const handleAddRecord = () => {
        setInsuranceData([
            ...insuranceData,
            { firmaUbezpieczeniowa: "", typUbezpieczenia: "", dataRozpoczecia: "", dataZakonczenia: "" },
        ]);
    };

    const handleChange = (index, field, value) => {
        const updatedInsurance = [...insuranceData];
        updatedInsurance[index][field] = value;
        setInsuranceData(updatedInsurance);
    };

    const handleRemoveRecord = (index) => {
        const updatedInsurance = insuranceData.filter((_, i) => i !== index);
        setInsuranceData(updatedInsurance);
    };

    const handleSaveAndClose = () => {
        onUpdate(insuranceData); // Zapisanie aktualnych danych
        onClose(); // Zamknięcie okna
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Ubezpieczenie</h2>
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
                {insuranceData.length === 0 ? (
                    <p className="no-data">Brak danych</p>
                ) : (insuranceData.map((record, index) => (
                    <div key={index} className="modal-form">
                        <label>
                            Firma Ubezpieczeniowa:
                            <CreatableSelect
                                value={record.firmaUbezpieczeniowa ? { value: record.firmaUbezpieczeniowa, label: record.firmaUbezpieczeniowa } : null}
                                onChange={(newValue) => handleChange(index, "firmaUbezpieczeniowa", newValue ? newValue.label : '')}
                                options={insurers.map(insurer => ({ value: insurer.nazwa, label: insurer.nazwa }))}
                                onCreateOption={(inputValue) => handleChange(index, "firmaUbezpieczeniowa", inputValue)}
                                placeholder="Wybierz lub dodaj firmę"
                                isClearable
                                styles={customSelectStyles}
                                required
                            />
                        </label>
                        <label>
                            Typ Ubezpieczenia:
                            <CreatableSelect
                                value={record.typUbezpieczenia ? { value: record.typUbezpieczenia, label: record.typUbezpieczenia } : null}
                                onChange={(newValue) => handleChange(index, "typUbezpieczenia", newValue ? newValue.label : '')}
                                options={insurers
                                    .find(insurer => insurer.nazwa === record.firmaUbezpieczeniowa)?.rodzajubezpieczenia
                                    .map(type => ({ value: type, label: type }))}
                                onCreateOption={(inputValue) => handleChange(index, "typUbezpieczenia", inputValue)}
                                placeholder="Wybierz lub dodaj typ"
                                isClearable
                                styles={customSelectStyles}
                                formatCreateLabel={(inputValue) => ''}
                                required
                            />
                        </label>
                        <label>
                            Data Rozpoczęcia:
                            <input
                                type="date"
                                value={record.dataRozpoczecia}
                                onChange={(e) =>
                                    handleChange(index, "dataRozpoczecia", e.target.value)
                                }
                            />
                        </label>
                        <label>
                            Data Zakończenia:
                            <input
                                type="date"
                                value={record.dataZakonczenia}
                                onChange={(e) =>
                                    handleChange(index, "dataZakonczenia", e.target.value)
                                }
                            />
                        </label>
                        <button
                            className="remove-button"
                            onClick={() => handleRemoveRecord(index)}
                        >
                            Usuń
                        </button>
                    </div>
                )))}

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

export default InsuranceModal;