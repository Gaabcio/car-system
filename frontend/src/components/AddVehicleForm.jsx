import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import './AddVehicleForm.css';
import ServiceHistoryModal from './ServiceHistoryModal';
import OwnersModal from './OwnersModal';
import InsuranceModal from './InsuranceModal';


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

const fuelOptions = [
    { value: 'Benzyna', label: 'Benzyna' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Elektryczny', label: 'Elektryczny' },
    { value: 'Hybrydowy', label: 'Hybrydowy' },
];

const bodyTypeOptions = [
    { value: 'Sedan', label: 'Sedan' },
    { value: 'Hatchback', label: 'Hatchback' },
    { value: 'Coupe', label: 'Coupe' },
    { value: 'SUV', label: 'SUV' },
    { value: 'Kombi', label: 'Kombi' },
    { value: 'Kabriolet', label: 'Kabriolet' },
];

const makeOptions = [
    { value: 'Audi', label: 'Audi' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Volkswagen', label: 'Volkswagen' },
    { value: 'Ford', label: 'Ford' },
    { value: 'Opel', label: 'Opel' },
    { value: 'Mercedes', label: 'Mercedes' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Skoda', label: 'Skoda' },
    { value: 'Renault', label: 'Renault' },
    { value: 'Peugeot', label: 'Peugeot' },
    { value: 'Honda', label: 'Honda' },
];

const modelsByMake = {
    Audi: ['A3', 'A4', 'Q5'],
    BMW: ['320i', '530i', 'X5'],
    Volkswagen: ['Golf', 'Passat', 'Tiguan'],
    Ford: ['Focus', 'Mondeo', 'Kuga'],
    Mercedes: ['A-Class', 'C-Class', 'GLC'],
    Toyota: ['Corolla', 'Yaris', 'RAV4'],
    Skoda: ['Octavia', 'Superb', 'Kodiaq'],
    Renault: ['Clio', 'Megane', 'Kadjar'],
    Peugeot: ['308', '3008', '5008'],
    Honda: ['Civic', 'Accord', 'CR-V'],
};

const AddVehicleForm = ({ onVehicleAdded, onClose }) => {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1899 }, (_, i) => ({
        value: currentYear - i,
        label: (currentYear - i).toString(),
    })).filter(option => option.value >= 1990 || option.value % 10 === 0); // Rok od 1990 lub co 10 lat

    const initialFormState = {
        numerRejestracyjny: '',
        vin: '',
        rokProdukcji: '',
        przebieg: '',
        rodzajPaliwa: '',
        marka: '',
        model: '',
        typ: '',
        historiaSerwisowa: [],
        wlasciciele: [],
        ubezpieczenie: []
    };

    const [vehicleData, setVehicleData] = useState(initialFormState);
    const [modelOptions, setModelOptions] = useState([]);
    const [showServiceHistoryModal, setShowServiceHistoryModal] = useState(false);
    const [showOwnersModal, setShowOwnersModal] = useState(false);
    const [showInsuranceModal, setShowInsuranceModal] = useState(false);

    // Update model options when make changes
    useEffect(() => {
        if (vehicleData.marka) {
            setModelOptions(modelsByMake[vehicleData.marka] || []);
        } else {
            setModelOptions([]);
        }
    }, [vehicleData.marka]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVehicleData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Funkcja do dodawania nowego rekordu historii serwisowej
    const handleAddServiceHistory = (history) => {
        setVehicleData(prevState => ({
            ...prevState,
            historiaSerwisowa: history,
        }));
        setShowServiceHistoryModal(false); // Zamknij modal po dodaniu
    };

    // Funkcja do dodawania nowego właściciela
    const handleAddOwners = (owners) => {
        setVehicleData(prevState => ({
            ...prevState,
            wlasciciele: owners,
        }));
        setShowOwnersModal(false); // Zamknij modal po dodaniu
    };

    const handleAddInsurance = (insurance) => {
        setVehicleData(prevState => ({
            ...prevState,
            ubezpieczenie: insurance,
        }));
        setShowInsuranceModal(false); // Zamknij modal po dodaniu
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setVehicleData(prevState => ({
            ...prevState,
            [name]: selectedOption ? selectedOption.value : '', // Przypisujemy value, a nie label
        }));
    };

    const handleCustomValue = (inputValue, setter) => {
        const cleanedValue = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // Usuń znaki nieliterowe i nienumeryczne
        if (cleanedValue) {
            setter({ label: cleanedValue, value: cleanedValue });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !vehicleData.marka ||
            !vehicleData.model ||
            !vehicleData.typ ||
            !vehicleData.rodzajPaliwa ||
            !vehicleData.rokProdukcji ||
            !vehicleData.przebieg ||
            !vehicleData.numerRejestracyjny ||
            !vehicleData.vin
        ) {
            alert('Proszę wypełnić wszystkie pola.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/pojazdy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehicleData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Błąd podczas dodawania pojazdu');
            }

            const addedVehicle = await response.json();
            console.log('Dodany pojazd:', addedVehicle);

            if (onVehicleAdded) {
                onVehicleAdded(); // Wywołanie funkcji odświeżającej dane w Dashboard
            }

            onClose(); // Zamknięcie modalu po dodaniu pojazdu
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };


    const handleResetForm = () => {
        setVehicleData(initialFormState); // Resetowanie formularza do początkowych wartości
    };

    const formatMileage = (value) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Formatowanie liczby
    };

    const parseMileage = (value) => {
        const rawValue = value.replace(/\s/g, ''); // Usuń spacje
        const numericValue = parseInt(rawValue, 10);
        return isNaN(numericValue) || numericValue < 0 ? '' : numericValue.toString(); // Zwróć wartość jako string bez zer wiodących
    };



    return (
        <div className="add-vehicle-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Dodaj pojazd</h2>
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

                <form onSubmit={handleSubmit}>
                    <label>
                        Marka pojazdu:
                        <CreatableSelect
                            name="marka"
                            value={vehicleData.marka ? { value: vehicleData.marka, label: vehicleData.marka } : null}
                            onChange={(newValue) => setVehicleData(prevState => ({
                                ...prevState,
                                marka: newValue ? newValue.label : '', // Przypisujemy label
                            }))}
                            options={makeOptions}
                            styles={customSelectStyles}
                            placeholder="Wprowadź lub wybierz markę"
                            isClearable
                            onCreateOption={(inputValue) => handleCustomValue(inputValue, (value) => setVehicleData(prevState => ({
                                ...prevState,
                                marka: value.label,
                            })))}
                            required
                            formatCreateLabel={(inputValue) => ''}  // Ukrycie napisu "Create"
                        />
                    </label>
                    <label>
                        Model pojazdu:
                        <CreatableSelect
                            name="model"
                            value={vehicleData.model ? { value: vehicleData.model, label: vehicleData.model } : null}
                            onChange={(newValue) => setVehicleData(prevState => ({
                                ...prevState,
                                model: newValue ? newValue.label : '', // Przypisujemy label
                            }))}
                            styles={customSelectStyles}
                            placeholder="Wprowadź lub wybierz model"
                            isClearable
                            options={modelOptions.map(model => ({ value: model, label: model }))}
                            onCreateOption={(inputValue) => handleCustomValue(inputValue, (value) => setVehicleData(prevState => ({
                                ...prevState,
                                model: value.label,
                            })))}
                            required
                            formatCreateLabel={(inputValue) => ''}  // Ukrycie napisu "Create"
                        />
                    </label>
                    <label>
                        Typ nadwozia:
                        <Select
                            name="typ"
                            value={vehicleData.typ ? { value: vehicleData.typ, label: vehicleData.typ } : null}
                            onChange={handleSelectChange}
                            options={bodyTypeOptions}
                            styles={customSelectStyles}
                            placeholder="Wybierz typ nadwozia"
                            isClearable
                            required
                        />
                    </label>
                    <label>
                        Rodzaj paliwa:
                        <Select
                            name="rodzajPaliwa"
                            value={vehicleData.rodzajPaliwa ? { value: vehicleData.rodzajPaliwa, label: vehicleData.rodzajPaliwa } : null}
                            onChange={handleSelectChange}
                            options={fuelOptions}
                            styles={customSelectStyles}
                            placeholder="Wybierz rodzaj paliwa"
                            isClearable
                            required
                        />
                    </label>

                    <label>
                        Rok produkcji:
                        <Select
                            name="rokProdukcji"
                            value={vehicleData.rokProdukcji ? { value: vehicleData.rokProdukcji, label: vehicleData.rokProdukcji.toString() } : null}
                            onChange={handleSelectChange}
                            options={yearOptions}
                            styles={customSelectStyles}
                            placeholder="Wybierz rok produkcji"
                            isClearable
                            required
                        />
                    </label>
                    <label>
                        Przebieg:
                        <CreatableSelect
                            name="przebieg"
                            value={
                                vehicleData.przebieg
                                    ? {
                                        value: vehicleData.przebieg,
                                        label: (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <span style={{ textAlign: 'left', flex: 1 }}>{formatMileage(vehicleData.przebieg)}</span>
                                                <span style={{ textAlign: 'right' }}>km</span>
                                            </div>
                                        ),
                                    }
                                    : null
                            }
                            onChange={(selectedOption) => {
                                const numericValue = parseMileage(selectedOption?.value || '');
                                setVehicleData((prevState) => ({
                                    ...prevState,
                                    przebieg: numericValue,
                                }));
                            }}
                            onCreateOption={(inputValue) => {
                                const numericValue = parseMileage(inputValue);
                                if (numericValue !== '') {
                                    setVehicleData((prevState) => ({
                                        ...prevState,
                                        przebieg: numericValue,
                                    }));
                                }
                            }}
                            options={[]}
                            placeholder="Wprowadź przebieg (km)"
                            isClearable
                            isSearchable
                            formatCreateLabel={(inputValue) => (
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <span style={{ textAlign: 'left', flex: 1 }}>{formatMileage(parseMileage(inputValue))}</span>
                                    <span style={{ marginLeft: 'right' }}>km</span>
                                </div>
                            )}
                            styles={{
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
                                option: (base) => ({
                                    ...base,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '10px',
                                    fontSize: '14px',
                                    color: '#333',
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }),
                            }}
                        />


                    </label>
                    <label>
                        Numer rejestracyjny:
                        <input
                            type="text"
                            name="numerRejestracyjny"
                            value={vehicleData.numerRejestracyjny}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        VIN:
                        <input
                            type="text"
                            name="vin"
                            value={vehicleData.vin}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <div className="form-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>Anuluj</button>
                        <button type="button" className="reset-btn" onClick={handleResetForm}>Wyczyść formularz</button>
                        <button type="submit" className="submit-btn">Dodaj pojazd</button>
                    </div>
                </form>
            </div>

            {showServiceHistoryModal && (
                <ServiceHistoryModal
                    history={vehicleData.historiaSerwisowa || []}
                    onClose={() => setShowServiceHistoryModal(false)}
                    onUpdate={handleAddServiceHistory}
                />
            )}

            {showOwnersModal && (
                <OwnersModal
                    owners={vehicleData.wlasciciele || []}
                    onClose={() => setShowOwnersModal(false)}
                    onUpdate={handleAddOwners}
                />
            )}

            {showInsuranceModal && (
                <InsuranceModal
                    insurance={vehicleData.ubezpieczenie || []} // Upewnij się, że przekazujesz pustą tablicę, jeśli nie ma ubezpieczenia
                    onClose={() => setShowInsuranceModal(false)}
                    onUpdate={handleAddInsurance}
                />
            )}

        </div>
    );
};

export default AddVehicleForm;
