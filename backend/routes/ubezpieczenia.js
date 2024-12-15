const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const readJSONFile = (filePath) => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

router.get('/ubezpieczenia', (req, res) => {
    const ubezpieczenia = readJSONFile(path.join(__dirname, '../data', 'ubezpieczenia.json'));
    res.json(ubezpieczenia);
});

module.exports = router;