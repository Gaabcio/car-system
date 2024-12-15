const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const readJSONFile = (filePath) => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

router.get('/warsztaty', (req, res) => {
    const pojazdy = readJSONFile(path.join(__dirname, '../data', 'warsztaty.json'));
    res.json(pojazdy);
});

module.exports = router;