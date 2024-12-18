import React, { useState, useEffect, useRef } from "react";
import { IoChevronDown, IoCloseCircleOutline } from "react-icons/io5";
import "./Dashboard.css";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Modal from 'react-modal';

const Dashboard = () => {

  const [pojazdy, setPojazdy] = useState([]); // Stan dla pojazdów
  const [filteredPojazdy, setFilteredPojazdy] = useState([]); // Stan dla przefiltrowanych pojazdów
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Stan dla wybranego pojazdu

  useEffect(() => {
    fetch('http://localhost:5000/api/pojazdy')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setPojazdy(data); // Ustaw dane pojazdów
          setFilteredPojazdy(data); // Ustaw przefiltrowane pojazdy
        })
        .catch(error => console.error('Error fetching data:', error));
  }, []);


  const [mileageFrom, setMileageFrom] = useState(""); // Stan dla "Przebieg od"
  const [mileageTo, setMileageTo] = useState(""); // Stan dla "Przebieg do"
  const [fuelTypes, setFuelTypes] = useState({
    benzyna: true,
    diesel: true,
    gaz: true,
  });
  const [showFuelOptions, setShowFuelOptions] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(""); // Wybrana marka
  const [selectedModel, setSelectedModel] = useState(""); // Wybrany model
  const [models, setModels] = useState([]); // Modele dostępne dla marki
  const [activeFilter, setActiveFilter] = useState("all"); // Stan dla aktywnego filtra
  const fuelTypeRef = useRef(null); // Referencja do kontenera opcji rodzaju paliwa
  const [selectedBodyType, setSelectedBodyType] = useState(""); // Wybrany typ nadwozia

  // Obsługa kliknięcia poza rodzaj paliwa
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fuelTypeRef.current && !fuelTypeRef.current.contains(e.target)) {
        setShowFuelOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Obsługa zmiany paliwa
  const handleFuelChange = (e) => {
    const { name, checked } = e.target;
    if (name === "all") {
      setFuelTypes({
        benzyna: checked,
        diesel: checked,
        gaz: checked,
      });
    } else {
      setFuelTypes((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  // Liczba wybranych paliw
  const selectedFuelCount = Object.values(fuelTypes).filter(Boolean).length;

  // Zresetowanie wyboru paliw
  const handleClearFuelSelection = () => {
    setFuelTypes({
      benzyna: false,
      diesel: false,
      gaz: false,
    });
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1899 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString(),
  })).filter(option => option.value >= 1990 || option.value % 10 === 0);

  // Opcje przebiegu (25 000, 50 000, ..., 250 000 km)
  const mileageOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 25000);

  const formatMileage = (mileage) => {
    if (!mileage) return "";
    return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleCustomValue = (inputValue, setter) => {
    const cleanedValue = inputValue.replace(/\D/g, ''); // Usuń znaki nienumeryczne
    if (cleanedValue) {
      setter({ label: `${formatMileage(cleanedValue)} km`, value: parseInt(cleanedValue, 10) });
    }
  };


  // Obsługa zmiany wartości "Rok produkcji od"
  const handleYearFromChange = (selectedOption) => {
    if (yearTo && selectedOption?.value > yearTo.value) {
      setYearTo(null); // Wyczyść "Rok produkcji do", jeśli "od" > "do"
    }
    setYearFrom(selectedOption);
  };

  // Obsługa zmiany wartości "Rok produkcji do"
  const handleYearToChange = (selectedOption) => {
    if (yearFrom && selectedOption?.value < yearFrom.value) {
      setYearFrom(null); // Wyczyść "Rok produkcji od", jeśli "do" < "od"
    }
    setYearTo(selectedOption);
  };


  // const handleMileageChange = (e, setter) => {
  //   const value = e.target.value.replace(/[^\d]/g, ""); // Usuń spacje i znaki
  //   setter(value); // Ustaw czystą wartość w stanie
  // };


  // Obsługa zmiany wartości "Przebieg od"
  const handleMileageFromChange = (option) => {
    if (mileageTo && option?.value > mileageTo.value) {
      setMileageTo(null); // Wyczyść "Przebieg do", jeśli wartość "od" jest większa
    }
    setMileageFrom(option);
  };

  // Obsługa zmiany wartości "Przebieg do"
  const handleMileageToChange = (option) => {
    if (mileageFrom && option?.value < mileageFrom.value) {
      setMileageFrom(null); // Wyczyść "Przebieg od", jeśli wartość "do" jest mniejsza
    }
    setMileageTo(option);
  };


  // Ustawienie modeli pojazdu w zależności od wybranej marki
  const handleBrandChange = (selectedOption) => {
    const brand = selectedOption ? selectedOption.value : "";
    setSelectedBrand(brand);
    setSelectedModel(""); // Resetujemy model przy zmianie marki

    // Ustaw dostępne modele w zależności od wybranej marki
    const availableModels = pojazdy
        .filter(pojazd => pojazd.marka === brand)
        .map(pojazd => ({ value: pojazd.model, label: pojazd.model }));

    setModels(availableModels);
  };

  // Zmieniamy wybrany model
  const handleModelChange = (selectedOption) => {
    setSelectedModel(selectedOption ? selectedOption.value : "");
  };

  // Funkcja obsługująca kliknięcie przycisku filtra
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };


  const [yearFrom, setYearFrom] = useState(null); // Rok produkcji od
  const [yearTo, setYearTo] = useState(null); // Rok produkcji do

  // Zmieniamy typ nadwozia
  const handleBodyTypeChange = (selectedOption) => {
    setSelectedBodyType(selectedOption ? selectedOption.value : "");
  };

  // Funkcja wyszukiwania
  const handleSearch = () => {
    const filtered = pojazdy.filter((pojazd) => {
      // Przykład logiki filtrowania
      const keyword = document.querySelector('.search-input').value.toLowerCase(); // Słowo kluczowe
      const vin = document.querySelector('#vin').value.toLowerCase(); // VIN

      if (keyword && !(
          pojazd.marka.toLowerCase().includes(keyword) ||
          pojazd.model.toLowerCase().includes(keyword) ||
          (pojazd.typ && pojazd.typ.toLowerCase().includes(keyword))
      )) return false;

      if (vin && !pojazd.vin.toLowerCase().includes(vin)) return false;      // VIN

      if (yearFrom && pojazd.rokProdukcji < yearFrom.value) return false;    //rok produkcj od
      if (yearTo && pojazd.rokProdukcji > yearTo.value) return false;        //rok produkcji do

      if (mileageFrom && pojazd.przebieg < mileageFrom.value) return false;  //przebieg od
      if (mileageTo && pojazd.przebieg > mileageTo.value) return false;      //przebieg do

      if (selectedBrand && pojazd.marka !== selectedBrand) return false;     //marka
      if (selectedModel && pojazd.model !== selectedModel) return false;     //model
      if (selectedBodyType && pojazd.typ !== selectedBodyType) return false; //typ nadwozia

      const selectedFuelTypes = Object.keys(fuelTypes).filter(fuel => fuelTypes[fuel]);
      if (selectedFuelTypes.length > 0 && !selectedFuelTypes.includes(pojazd.rodzajPaliwa.toLowerCase())) return false;

      return true;
    });
    setFilteredPojazdy(filtered);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">

        {/* Modal dla szczegółów pojazdu */}
        {selectedVehicle && (
            <Modal
                isOpen={!!selectedVehicle}
                onRequestClose={() => setSelectedVehicle(null)}
                contentLabel="Szczegóły pojazdu"
            >
              <h2>{`${selectedVehicle.marka} ${selectedVehicle.model} ${selectedVehicle.rokProdukcji}`}</h2>
              <p>Typ: {selectedVehicle.typ}</p>
              <p>VIN: {selectedVehicle.vin}</p>
              <p>Kolor: {selectedVehicle.kolor}</p>
              <p>Przebieg: {selectedVehicle.przebieg} km</p>
              <p>Pojemność silnika: {selectedVehicle.pojemnoscSilnika} cm³</p>
              <h3>Historia serwisowa</h3>
              <ul>
                {selectedVehicle.historiaSerwisowa.map((serwis, index) => (
                    <li key={index}>
                      {serwis.data}: {serwis.opis} ({serwis.warsztat})
                    </li>
                ))}
              </ul>
              <h3>Właściciele</h3>
              <ul>
                {selectedVehicle.wlasciciele.map((wlasciciel, index) => (
                    <li key={index}>
                      {wlasciciel.imie} {wlasciciel.nazwisko} (Zakup: {wlasciciel.dataZakupu}, Sprzedaż: {wlasciciel.dataSprzedazy || 'N/A'})
                    </li>
                ))}
              </ul>
              <button onClick={() => setSelectedVehicle(null)}>Zamknij</button>
            </Modal>
        )}

        <h1 className="dashboard-title">Wyszukaj Pojazd</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Wprowadź słowo kluczowe"
            className="search-input"
          />
          <input type="text" placeholder="VIN" className="search-input" id="vin"/>

          <div className="search-input-group">
            {/* Rok produkcji od */}
            <div className="select-wrapper">
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={yearFrom}
                onChange={handleYearFromChange}
                options={yearOptions}
                placeholder="Rok produkcji od"
                isClearable
                isSearchable
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  control: (base, state) => ({
                    ...base,
                    width: '200px',
                    borderRadius: '5px',
                    boxShadow: 'none',
                    height: '42px',
                    borderColor: state.isFocused ? 'black' : '#ccc',
                    '&:hover': {
                      borderColor: state.isFocused ? 'black' : '#ccc',
                    },
                    borderWidth: '2px',
                    textAlign: 'left',
                  }),
                  clearIndicator: (base) => ({
                    ...base,
                    color: 'darkgray',
                    ':hover': {
                      color: 'black',
                    },
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: 'darkgray',
                    ':hover': {
                      color: 'black',
                    },
                  }),
                }}
              />
            </div>

            {/* Rok produkcji do */}
            <div className="select-wrapper">
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={yearTo}
                onChange={handleYearToChange}
                options={yearOptions}
                placeholder="Rok produkcji do"
                isClearable
                isSearchable
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  control: (base, state) => ({
                    ...base,
                    width: '200px',
                    borderRadius: '5px',
                    boxShadow: 'none',
                    height: '42px',
                    borderColor: state.isFocused ? 'black' : '#ccc',
                    '&:hover': {
                      borderColor: state.isFocused ? 'black' : '#ccc',
                    },
                    borderWidth: '2px',
                    textAlign: 'left',
                  }),
                  clearIndicator: (base) => ({
                    ...base,
                    color: 'darkgray',
                    ':hover': {
                      color: 'black',
                    },
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: 'darkgray',
                    ':hover': {
                      color: 'black',
                    },
                  }),
                }}
              />
            </div>
          </div>

          <div className="search-input-group">
            {/* Przebieg od */}
            <div className="select-wrapper">
              <CreatableSelect
                className="basic-single"
                classNamePrefix="select"
                value={mileageFrom}
                onChange={handleMileageFromChange}
                onCreateOption={(inputValue) => handleCustomValue(inputValue, setMileageFrom)}
                options={mileageOptions.map((mileage) => ({
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{formatMileage(mileage)}</span>
                      <span style={{ marginLeft: 'auto', paddingLeft: '10px' }}>km</span>
                    </div>
                  ),
                  value: mileage,
                }))}
                placeholder="Przebieg od (km)"
                isClearable
                isSearchable={true}
                formatCreateLabel={() => ''} // Usuń napis "Create"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  control: (base, state) => ({
                    ...base,
                    width: '200px',
                    borderRadius: '5px',
                    boxShadow: 'none',
                    height: '42px',
                    borderColor: state.isFocused ? 'black' : '#ccc',
                    '&:hover': {
                      borderColor: state.isFocused ? 'black' : '#ccc',
                    },
                    borderWidth: '2px',
                    textAlign: 'left',
                  }),
                  clearIndicator: (base) => ({
                    ...base,
                    color: 'darkgray',
                    ':hover': {
                      color: 'black',
                    },
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: 'darkgray',
                    ':hover': {
                      color: 'black',
                    },
                  }),
                }}
              />
            </div>

            {/* Przebieg do */}
            <div className="select-wrapper">
              <CreatableSelect
                className="basic-single"
                classNamePrefix="select"
                value={mileageTo}
                onChange={handleMileageToChange}
                onCreateOption={(inputValue) => handleCustomValue(inputValue, setMileageTo)}
                options={mileageOptions.map((mileage) => ({
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{formatMileage(mileage)}</span>
                      <span style={{ marginLeft: 'auto', paddingLeft: '10px' }}>km</span>
                    </div>
                  ),
                  value: mileage,
                }))}
                placeholder="Przebieg do (km)"
                isClearable
                isSearchable={true}
                formatCreateLabel={() => ''} // Usuń napis "Create"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  control: (base, state) => ({
                    ...base,
                    width: '200px',
                    borderRadius: '5px',
                    boxShadow: 'none',
                    height: '42px',
                    borderColor: state.isFocused ? 'black' : '#ccc',
                    '&:hover': {
                      borderColor: state.isFocused ? 'black' : '#ccc',
                    },
                    borderWidth: '2px',
                    textAlign: 'left',
                  }),
                  clearIndicator: (base) => ({
                    ...base,
                    color: 'darkgray',
                    ':hover': {
                      color: 'black',
                    },
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: 'darkgray',
                    ':hover': {
                      color: 'black',
                    },
                  }),
                }}
              />
            </div>
          </div>



          {/* Rodzaj paliwa */}
          <div className="fuel-type-container" ref={fuelTypeRef}>
            <div
              className="fuel-type-label"
              onClick={() => setShowFuelOptions(!showFuelOptions)}
            >
              Rodzaj paliwa
              {selectedFuelCount > 0 && (
                <div className="fuel-count">
                  {selectedFuelCount}
                </div>
              )}
              {/* Zmieniamy ikonę w zależności od tego, czy paliwa zostały wybrane */}
              {selectedFuelCount > 0 ? (
                <IoCloseCircleOutline
                  className="fuel-type-icon"
                  onClick={handleClearFuelSelection}
                />
              ) : (
                <IoChevronDown
                  className={`fuel-type-icon ${showFuelOptions ? "open" : ""}`}
                />
              )}
            </div>
            {showFuelOptions && (
              <div className="fuel-type-options">
                <label>
                  <input
                    type="checkbox"
                    name="all"
                    checked={fuelTypes.benzyna && fuelTypes.diesel && fuelTypes.gaz}
                    onChange={handleFuelChange}
                  />
                  Wszystkie rodzaje paliwa
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="benzyna"
                    checked={fuelTypes.benzyna}
                    onChange={handleFuelChange}
                  />
                  Benzyna
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="diesel"
                    checked={fuelTypes.diesel}
                    onChange={handleFuelChange}
                  />
                  Diesel
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="gaz"
                    checked={fuelTypes.gaz}
                    onChange={handleFuelChange}
                  />
                  Gaz
                </label>
              </div>
            )}
          </div>

          {/* Marka pojazdu */}
          <div className="select-wrapper">
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={selectedBrand ? { value: selectedBrand, label: selectedBrand } : null}
              onChange={handleBrandChange}
              options={pojazdy.map(pojazd => ({ value: pojazd.marka, label: pojazd.marka }))} // Ustaw marki z danych
              placeholder="Marka pojazdu"
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
                control: (base, state) => ({
                  ...base,
                  width: '200px',
                  borderRadius: '5px',
                  boxShadow: 'none',
                  height: '42px',
                  borderColor: state.isFocused ? 'black' : '#ccc',
                  '&:hover': {
                    borderColor: state.isFocused ? 'black' : '#ccc',
                  },
                  borderWidth: '2px',
                  textAlign: 'left',
                }),
                clearIndicator: (base) => ({
                  ...base,
                  color: 'darkgray',
                  ':hover': {
                    color: 'black',
                  },
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: 'darkgray',
                  ':hover': {
                    color: 'black',
                  },
                }),
              }}
            />
          </div>

          {/* Model pojazdu */}
          <div className="select-wrapper">
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={selectedModel ? { value: selectedModel, label: selectedModel } : null}
              onChange={handleModelChange}
              options={models}//
              placeholder="Model pojazdu"
              isClearable
              isSearchable
              isDisabled={!selectedBrand}  // Disabled, jeśli marka nie jest wybrana
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
                control: (base, state) => ({
                  ...base,
                  width: '200px',
                  borderRadius: '5px',
                  boxShadow: 'none',
                  height: '42px',
                  borderColor: state.isFocused ? 'black' : '#ccc',
                  '&:hover': {
                    borderColor: state.isFocused ? 'black' : '#ccc',
                  },
                  borderWidth: '2px',
                  textAlign: 'left',
                }),
                clearIndicator: (base) => ({
                  ...base,
                  color: 'darkgray',
                  ':hover': {
                    color: 'black',
                  },
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: 'darkgray',
                  ':hover': {
                    color: 'black',
                  },
                }),
              }}
            />
          </div>

          {/* Typ nadwozia */}
          <div className="select-wrapper">
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={selectedBodyType ? { value: selectedBodyType, label: selectedBodyType } : null}
              onChange={handleBodyTypeChange}
              options={[
                { value: "Sedan", label: "Sedan" },
                { value: "Hatchback", label: "Hatchback" },
                { value: "SUV", label: "SUV" },
                { value: "Coupe", label: "Coupe" },
              ]}
              placeholder="Typ nadwozia"
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
                control: (base, state) => ({
                  ...base,
                  width: '200px',
                  borderRadius: '5px',
                  boxShadow: 'none',
                  height: '42px',
                  borderColor: state.isFocused ? 'black' : '#ccc',
                  '&:hover': {
                    borderColor: state.isFocused ? 'black' : '#ccc',
                  },
                  borderWidth: '2px',
                  textAlign: 'left',
                }),
                clearIndicator: (base) => ({
                  ...base,
                  color: 'darkgray',
                  ':hover': {
                    color: 'black',
                  },
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: 'darkgray',
                  ':hover': {
                    color: 'black',
                  },
                }),
              }}
            />
          </div>

          <button className="search-button" onClick={handleSearch}>Wyszukaj</button>
        </div>

        {/* Filter Buttons */}
        <div className="search-results-header">
          <span className="sorted-by">Sortuj:</span>
          <button
            className={`filter-button ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterClick("all")}
          >
            Wszystkie <span className="badge">{filteredPojazdy.length}</span>
          </button>
          <button
            className={`filter-button ${activeFilter === "ready" ? "active" : ""}`}
            onClick={() => handleFilterClick("ready")}
          >
            Gotowe <span className="badge">423</span>
          </button>
          <button
            className={`filter-button ${activeFilter === "not-ready" ? "active" : ""}`}
            onClick={() => handleFilterClick("not-ready")}
          >
            Niegotowe <span className="badge">77</span>
          </button>
        </div>

        {/* Wyniki wyszukiwania */}
        <div className="search-results">

          {filteredPojazdy.map((pojazd) => (
              <div className="vehicle-card" key={pojazd._id}>
                <div className="vehicle-icon">🚗</div>
                <h3 className="vehicle-title">{`${pojazd.rokProdukcji} ${pojazd.marka} ${pojazd.model}`}</h3>
                <button className="details-button" onClick={() => setSelectedVehicle(pojazd)}>Zobacz szczegóły</button>
              </div>
          ))}


          {/*{Array(8).fill(0).map((_, index) => (*/}
          {/*  <div className="vehicle-card" key={index}>*/}
          {/*    <div className="vehicle-icon">🚗</div>*/}
          {/*    <h3 className="vehicle-title">2021 BMW 335i</h3>*/}
          {/*    /!*<p className="vehicle-vin">VIN: 07B03JNDGOE89956</p>*!/*/}
          {/*    <button className="details-button">Zobacz szczegóły</button>*/}
          {/*  </div>*/}
          {/*))}*/}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
