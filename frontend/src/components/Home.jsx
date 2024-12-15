// frontend/src/components/Home.jsx
import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import StepsProcess from './StepsProcess';

const Home = () => {
    return (
        <div className="home-container">
            <div className="content-card">
                <h1>Witamy w Systemie Zarządzania Pojazdami</h1>
                <p>
                    System przeznaczony jest dla administratorów stacji diagnostycznych. 
                    Ułatwia zarządzanie bazą danych pojazdów oraz procesami diagnostycznymi. 
                    Zaloguj się, aby uzyskać dostęp do pełnych funkcji.
                </p>
                <Link to="/login" className="login-button">Zaloguj się</Link>
            </div>

            {/* Sekcja statystyk */}
            <div className="stats-section">
                <div className="stats-card">
                    <div className="icon-wrapper">
                        <ion-icon name="business-outline"></ion-icon>
                    </div>
                    <h2>123</h2>
                    <p>Liczba warsztatów</p>
                </div>
                <div className="stats-card">
                    <div className="icon-wrapper">
                        <ion-icon name="people-outline"></ion-icon>
                    </div>
                    <h2>456</h2>
                    <p>Liczba pracowników</p>
                </div>
                <div className="stats-card">
                    <div className="icon-wrapper">
                        <ion-icon name="checkmark-done-outline"></ion-icon>
                    </div>
                    <h2>789</h2>
                    <p>Zrealizowane usługi</p>
                </div>
                <div className="stats-card">
                    <div className="icon-wrapper">
                        <ion-icon name="person-add-outline"></ion-icon>
                    </div>
                    <h2>101</h2>
                    <p>Liczba klientów</p>
                </div>
            </div>
            <StepsProcess />
        </div>
    );
};

export default Home;
