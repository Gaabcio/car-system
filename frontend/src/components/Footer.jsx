// frontend/src/components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} System Zarządzania Pojazdami. Wszystkie prawa zastrzeżone.</p>
        </footer>
    );
};

export default Footer;
