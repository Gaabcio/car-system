const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Funkcja do odczytu pliku JSON
const readJSONFile = (filePath) => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Funkcja do zapisu pliku JSON
const writeJSONFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Endpoint do pobierania ubezpieczeń
router.get('/ubezpieczenia', (req, res) => {
    const ubezpieczenia = readJSONFile(path.join(__dirname, '../data', 'ubezpieczenia.json'));
    res.json(ubezpieczenia);
});

// // Endpoint do pobierania ubezpieczeń dla danego VIN
// router.get('/ubezpieczenia/:vin', (req, res) => {
//     const vin = req.params.vin;
//
//     const ubezpieczenia = readJSONFile(path.join(__dirname, '../data', 'ubezpieczenia.json'));
//     const filteredUbezpieczenia = ubezpieczenia.filter(u => u.vin === vin);
//
//     res.json(filteredUbezpieczenia);
// });

// // Endpoint do zapisywania ubezpieczeń
// router.post('/ubezpieczenia', (req, res) => {
//     const newInsurance = req.body;
//     const ubezpieczenia = readJSONFile(path.join(__dirname, '../data', 'ubezpieczenia.json'));
//
//     // Dodaj nowe ubezpieczenie do istniejącej listy
//     ubezpieczenia.push(newInsurance);
//
//     // Zapisz zaktualizowaną listę do pliku
//     writeJSONFile(path.join(__dirname, '../data', 'ubezpieczenia.json'), ubezpieczenia);
//
//     res.status(201).json(newInsurance); // Zwróć nowo dodane ubezpieczenie
// });
//

// // Endpoint do zapisywania ubezpieczeń
// router.post('/ubezpieczenia', (req, res) => {
//     const newInsurance = req.body;
//     const ubezpieczenia = readJSONFile(path.join(__dirname, '../data', 'ubezpieczenia.json'));
//
//     // Znajdź najwyższe id w istniejących ubezpieczeniach
//     const maxId = ubezpieczenia.reduce((max, u) => (u._id > max ? u._id : max), 0);
//
//     // Ustaw id nowego ubezpieczenia na maxId + 1
//     newInsurance._id = maxId + 1;
//
//     // Dodaj nowe ubezpieczenie do istniejącej listy
//     ubezpieczenia.push(newInsurance);
//
//     // Zapisz zaktualizowaną listę do pliku
//     writeJSONFile(path.join(__dirname, '../data', 'ubezpieczenia.json'), ubezpieczenia);
//
//     res.status(201).json(newInsurance); // Zwróć nowo dodane ubezpieczenie
// });

module.exports = router;