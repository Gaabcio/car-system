import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login = () => {



    const [formState, setFormState] = useState('login'); // Stan dla widoków formularza
    const [loginEmail, setLoginEmail] = useState(localStorage.getItem('loginEmail') || '');
    const [loginPassword, setLoginPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    //const [MessageEmail, setMessageEmail] = useState(''); // Nowy stan dla adresu email do wysłania wiadomości
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const navigate = useNavigate(); // Hook do nawigacji

    const switchToLogin = () => {
        setFormState('login'); // Przełącza formularz na logowanie
        setForgotEmail(''); // Czyści pole resetowania hasła
        setResetEmailSent(false); // Resetuje status wysłania emaila
    };
    const switchToRegister = () => setFormState('register');
    const switchToForgotPassword = () => setFormState('forgotPassword');

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setResetEmailSent(true); // Ustawia, że email został wysłany
    };
    const handleLogin = (e) => {
        e.preventDefault();
        // Wysyłanie danych logowania do backendu
        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: loginEmail, // Użyj loginEmail jako login
                password: loginPassword,
            }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Invalid credentials');
            })
            .then(data => {
                localStorage.setItem('authToken', data.token)
                console.log(data.message); // Logowanie udane
                navigate('/dashboard'); // Przekierowanie do Dashboard.jsx
            })
            .catch(error => {
                console.error(error.message); // Logowanie nieudane
            });
        if (rememberMe) {
            localStorage.setItem('loginEmail', loginEmail);
        } else {
            localStorage.removeItem('loginEmail');
        }
        localStorage.setItem('rememberMe', rememberMe);
        console.log('Logowanie...');
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // Sprawdzenie, czy e-mail już istnieje
        fetch('http://localhost:5000/api/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: registerEmail }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message); // Obsłuż błąd zwracany przez backend
                    });
                }
                // Jeśli e-mail nie istnieje, kontynuuj rejestrację
                return fetch('http://localhost:5000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: registerName,
                        login: registerEmail,
                        password: registerPassword,
                        rola: 'user',
                    }),
                });
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                return response.json().then(err => {
                    throw new Error(err.message); // Obsłuż błąd zwracany przez backend
                });
            })
            .then(data => {
                console.log(data.message); // Rejestracja udana
                alert("Rejestracja zakończona sukcesem!");
                setRegisterError(''); // Wyczyszczenie błędu
                switchToLogin(); // Przekierowanie do formularza logowania
            })
            .catch(error => {
                console.error(error.message); // Wyświetl błąd w konsoli
                setRegisterError(error.message); // Ustawienie komunikatu błędu
            });
    };


    //wysłanie maila resetującego
    const handleSendEmail = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail: forgotEmail, message: 'test'}),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to send message');
            })
            .then(data => {
                console.log(data.message);
                alert("Wiadomość wysłana pomyślnie!");
                //setMessageEmail('');
                switchToLogin();
            })
            .catch(error => {
                console.error(error.message);
                alert("Błąd podczas wysyłania wiadomości");
            });
    };



    return (
        <div className="login-container">
            <div className="background-container">
                <div
                    className={`wrapper ${formState === 'register' ? 'active' : formState === 'forgotPassword' ? (resetEmailSent ? 'email-sent-active' : 'forgot-active') : ''}`}
                >
                    {formState === 'login' && (
                        <div className="form-box login show">
                            <h2>Zaloguj się</h2>
                            <form onSubmit={handleLogin}>
                                <div className="input-box">
                                    <span className="icon"><ion-icon name="mail"></ion-icon></span>
                                    <input
                                        type="email"
                                        placeholder=" "
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                    />
                                    <label>Email</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon"><ion-icon name="lock-closed"></ion-icon></span>
                                    <input
                                        type="password"
                                        placeholder=" "
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                    <label>Hasło</label>
                                </div>
                                <div className="remember-forgot">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        /> Zapamiętaj mnie
                                    </label>
                                    <a href="/" role="button" onClick={(e) => { e.preventDefault(); switchToForgotPassword(); }}>Zapomniałeś hasła?</a>
                                </div>
                                <button type="submit" className="btn">Zaloguj się</button>
                                <div className="login-register">
                                    <p>Nie masz konta?<a href="/" role="button" onClick={(e) => { e.preventDefault(); switchToRegister(); }}> Załóż</a></p>
                                </div>
                            </form>
                        </div>
                    )}
                    {formState === 'register' && (
                        <div className="form-box register show">
                            <h2>Zarejestruj się</h2>
                            <form onSubmit={handleRegister}>
                                <div className="input-box">
                                    <span className="icon"><ion-icon name="person"></ion-icon></span>
                                    <input
                                        type="text"
                                        placeholder=" "
                                        value={registerName}
                                        onChange={(e) => setRegisterName(e.target.value)}
                                        required
                                    />
                                    <label>Imię</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon"><ion-icon name="mail"></ion-icon></span>
                                    <input
                                        type="email"
                                        placeholder=" "
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        required
                                    />
                                    <label>Email</label>
                                </div>
                                <div className="input-box">
                                    <span className="icon"><ion-icon name="lock-closed"></ion-icon></span>
                                    <input
                                        type="password"
                                        placeholder=" "
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        required
                                    />
                                    <label>Hasło</label>
                                </div>
                                <button type="submit" className="btn">Zarejestruj się</button>
                                {registerError && <p className="error-message">{registerError}</p>}
                                <div className="login-register">
                                    <p>Masz już konto?<a href="/" role="button" onClick={(e) => { e.preventDefault(); switchToLogin(); }}> Zaloguj się</a></p>
                                </div>
                            </form>
                        </div>
                    )}
                    {formState === 'forgotPassword' && (
                        <div className="form-box forgot show">
                            {!resetEmailSent ? (
                                <>
                                    <h2>Resetuj hasło</h2>
                                    <form onSubmit={handleForgotPassword}>
                                        <div className="input-box">
                                            <span className="icon"><ion-icon name="mail"></ion-icon></span>
                                            <input
                                                type="email"
                                                placeholder=" "
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                required
                                            />
                                            <label>Wprowadź swój email</label>
                                        </div>
                                        <button type="submit" className="btn" onClick={handleSendEmail}>Wyślij link resetujący</button>
                                    </form>
                                    <p className="back-to-login">
                                        <a href="/" role="button" onClick={(e) => { e.preventDefault(); switchToLogin(); }}>Wróć do logowania</a>
                                    </p>
                                </>
                            ) : (
                                <div className="reset-message">
                                    <h2>Email został wysłany</h2>
                                    <p>Przesłano maila na podany adres: <strong>{forgotEmail}</strong></p>
                                    <p>
                                        <a href="/" role="button" onClick={(e) => { e.preventDefault(); switchToLogin(); }}>
                                            Wróć do logowania
                                        </a>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Login;