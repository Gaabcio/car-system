const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const readJSONFile = (filePath) => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

router.get('/pojazdy', (req, res) => {
    const pojazdy = readJSONFile(path.join(__dirname, '../data', 'pojazdy.json'));
    res.json(pojazdy);
});

module.exports = router;