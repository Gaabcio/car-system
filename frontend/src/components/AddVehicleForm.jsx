import React, { useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import './AddVehicleForm.css';

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

const AddVehicleForm = ({ onClose }) => {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1899 }, (_, i) => ({
        value: currentYear - i,
        label: (currentYear - i).toString(),
    })).filter(option => option.value >= 1990 || option.value % 10 === 0); // Rok od 1990 lub co 10 lat

    const initialFormState = {
        plateNumber: '',
        vin: '',
        year: '',
        mileage: '',
        fuelType: '',
        make: '',
        model: '',
        bodyType: '',
    };

    const [vehicleData, setVehicleData] = useState(initialFormState);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVehicleData(prevState => ({
            ...prevState,
            [name]: value,
        }));
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            !vehicleData.make ||
            !vehicleData.model ||
            !vehicleData.bodyType ||
            !vehicleData.fuelType ||
            !vehicleData.year ||
            !vehicleData.mileage ||
            !vehicleData.plateNumber ||
            !vehicleData.vin
        ) {
            alert('Proszę wypełnić wszystkie pola.');
            return;
        }

        console.log('Dodany pojazd:', vehicleData);
        onClose(); // Zamknięcie modalu po dodaniu pojazdu
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
        return isNaN(numericValue) || numericValue < 0 ? '' : numericValue; // Zwróć tylko liczby >= 0
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
                            name="make"
                            value={vehicleData.make ? { value: vehicleData.make, label: vehicleData.make } : null}
                            onChange={(newValue) => setVehicleData(prevState => ({
                                ...prevState,
                                make: newValue ? newValue.label : '', // Przypisujemy label
                            }))}
                            styles={customSelectStyles}
                            placeholder="Wprowadź lub wybierz markę"
                            isClearable
                            onCreateOption={(inputValue) => handleCustomValue(inputValue, (value) => setVehicleData(prevState => ({
                                ...prevState,
                                make: value.label,
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
                            name="bodyType"
                            value={vehicleData.bodyType ? { value: vehicleData.bodyType, label: vehicleData.bodyType } : null}
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
                            name="fuelType"
                            value={vehicleData.fuelType ? { value: vehicleData.fuelType, label: vehicleData.fuelType } : null}
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
                            name="year"
                            value={vehicleData.year ? { value: vehicleData.year, label: vehicleData.year.toString() } : null}
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
                            name="mileage"
                            value={
                                vehicleData.mileage
                                    ? {
                                        value: vehicleData.mileage,
                                        label: (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <span style={{ textAlign: 'left', flex: 1 }}>{formatMileage(vehicleData.mileage)}</span>
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
                                    mileage: numericValue,
                                }));
                            }}
                            onCreateOption={(inputValue) => {
                                const numericValue = parseMileage(inputValue);
                                if (numericValue !== '') {
                                    setVehicleData((prevState) => ({
                                        ...prevState,
                                        mileage: numericValue,
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
                            name="plateNumber"
                            value={vehicleData.plateNumber}
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
        </div>
    );
};

export default AddVehicleForm;
