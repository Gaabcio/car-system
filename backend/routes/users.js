const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const sendEmail = require('./sendEmail'); // Import funkcji wysyłania emaili

const SECRET_KEY = 'your_secret_key'; // Użyj silnego klucza tajnego

const readJSONFile = (filePath) => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

router.get('/users', (req, res) => {
    const users = readJSONFile(path.join(__dirname, '../data', 'users.json'));
    res.json(users);
});

router.post('/login', (req, res) => {
    const { login, password } = req.body;
    const usersPath = path.join(__dirname, '../data', 'users.json');
    const users = readJSONFile(usersPath);
    const user = users.find(u => u.login === login && u.password === password);
    if (user) {
        const token = jwt.sign({ id: user._id, login: user.login }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ success: true, message: 'Login successful', token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token required' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user; // Dodanie użytkownika do żądania
        next();
    });
};

router.post('/check-email', (req, res) => {
    const { login } = req.body;
    const usersPath = path.join(__dirname, '../data', 'users.json');
    const users = readJSONFile(usersPath);

    const existingUser = users.find(u => u.login.toLowerCase() === login.toLowerCase());
    if (existingUser) {
        return res.status(400).json({ message: 'Użytkownik o tym adresie e-mail już istnieje' });
    }
    res.status(200).json({ message: 'E-mail dostępny' });
});

router.post('/register', (req, res) => {
    const { name, login, password } = req.body;
    const usersFilePath = path.join(__dirname, '../data', 'users.json');
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading users file' });
        }
        const users = JSON.parse(data);
        const existingUser = users.find(user => user.login.toLowerCase() === login.toLowerCase());
        if (existingUser) {
            return res.status(400).json({ message: 'Użytkownik o tym adresie e-mail już istnieje' });
        }
        const newUser = {
            _id: users.length + 1,
            login,
            password,
            rola: 'user',
            name
        };
        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving user' });
            }
            res.status(201).json({ message: 'Użytkownik zarejestrowany pomyślnie' });
        });
    });
});

// router.post('/send-message', (req, res) => {
//     const { mail, message } = req.body;
//     sendEmail(mail, 'Test Message', message);
//     res.status(200).json({ message: 'Email sent successfully' });
// });


const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Generuje losowe hasło o długości 8 znaków
};

router.post('/send-message', (req, res) => {
    const { mail } = req.body;
    const usersFilePath = path.join(__dirname, '../data', 'users.json');
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading users file' });
        }
        const users = JSON.parse(data);
        const user = users.find(user => user.login.toLowerCase() === mail.toLowerCase());
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newPassword = generateRandomPassword();
        user.password = newPassword;
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving new password' });
            }
            sendEmail(mail, 'Password Reset', 'Your password has been reset.', newPassword);
            res.status(200).json({ message: 'Password reset successfully' });
        });
    });
});


module.exports = router;