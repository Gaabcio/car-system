const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Funkcja do odczytu pliku JSON
const readJSONFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

const writeJSONFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Endpoint do pobierania pojazdów
router.get('/pojazdy', (req, res) => {
    const pojazdy = readJSONFile(path.join(__dirname, '../data', 'pojazdy.json'));
    res.json(pojazdy);
});

// Endpoint do dodawania nowego pojazdu
router.post('/pojazdy', (req, res) => {

    const pojazdy = readJSONFile(path.join(__dirname, '../data', 'pojazdy.json'));
    const { vin } = req.body;

    const existingVehicle = pojazdy.find(pojazd => pojazd.vin === vin);
    if (existingVehicle) {
        return res.status(400).json({ message: 'Pojazd z tym samym VIN-em już istnieje' });
    }

    const newVehicle = req.body;
    // Dodaj nowy pojazd do istniejącej listy
    pojazdy.push({ ...newVehicle, _id: pojazdy.length + 1 }); // Dodaj unikalne ID

    // Zapisz zaktualizowaną listę do pliku
    fs.writeFileSync(path.join(__dirname, '../data', 'pojazdy.json'), JSON.stringify(pojazdy, null, 2));

    res.status(201).json(newVehicle); // Zwróć nowo dodany pojazd
});

// Endpoint do aktualizacji pojazdu
router.put('/pojazdy/:id', (req, res) => {
    const { id } = req.params; // Pobierz ID pojazdu z parametrów
    const updatedVehicle = req.body; // Odbierz zaktualizowane dane pojazdu
    const pojazdy = readJSONFile(path.join(__dirname, '../data', 'pojazdy.json'));

    // Znajdź pojazd do aktualizacji
    const vehicleIndex = pojazdy.findIndex(p => p._id === parseInt(id));
    if (vehicleIndex === -1) {
        return res.status(404).json({ message: 'Pojazd nie znaleziony' });
    }

    // Zaktualizuj dane pojazdu
    pojazdy[vehicleIndex] = { ...pojazdy[vehicleIndex], ...updatedVehicle };

    // Zapisz zaktualizowaną listę do pliku
    fs.writeFileSync(path.join(__dirname, '../data', 'pojazdy.json'), JSON.stringify(pojazdy, null, 2));

    res.status(200).json(pojazdy[vehicleIndex]); // Zwróć zaktualizowany pojazd
});

// Endpoint do usuwania pojazdu
router.delete('/pojazdy/:id', (req, res) => {
    const pojazdy = readJSONFile(path.join(__dirname, '../data', 'pojazdy.json'));
    const updatedPojazdy = pojazdy.filter(pojazd => pojazd._id !== parseInt(req.params.id, 10));

    writeJSONFile(path.join(__dirname, '../data', 'pojazdy.json'), updatedPojazdy);
    res.status(200).json({ message: 'Pojazd usunięty pomyślnie' });
});




module.exports = router;