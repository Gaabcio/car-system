import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import { isAuthenticated, logout } from '../auth';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(isAuthenticated());
    const navigate = useNavigate();

    const handleScroll = () => {
        setScrolled(window.scrollY > 50);
    };

    const toggleMenu = () => {
        setMenuOpen((prevState) => !prevState);
    };

    const handleLogout = () => {
        logout();
        setLoggedIn(false);
        navigate('/login');
    };

    // Sprawdzamy, czy użytkownik jest zalogowany przy pierwszym renderze
    useEffect(() => {
        setLoggedIn(isAuthenticated());
    }, []);

    // Nasłuchiwanie na zmianę szerokości ekranu
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMenuOpen(false);  // Zamykanie menu po przejściu na większy ekran
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        // Sprzątanie po unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <header className={`navbar ${scrolled ? 'shrink' : ''}`}>
            <div className="logo">
                <img src={logo} alt="Logo" className="logo-icon" />
                <NavLink
                    to="/"
                    className="logo-text"
                    onClick={(e) => {
                        if (loggedIn) {
                            e.preventDefault(); // Zatrzymuje domyślne przejście na stronę główną
                        }
                    }}
                >
                    System Zarządzania Pojazdami
                </NavLink>
            </div>
            <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            <ul className={`navbar-navItems ${menuOpen ? 'active' : ''}`}>
                {!loggedIn && <li><NavLink to="/" exact activeClassName="active">STRONA GŁÓWNA</NavLink></li>}
                {loggedIn ? (
                    <>
                        <li><NavLink to="/dashboard" activeClassName="active">DASHBOARD</NavLink></li>
                        <li><NavLink to="/login" activeClassName="active" onClick={handleLogout}>WYLOGUJ SIĘ</NavLink></li>

                    </>
                ) : (
                    <li><NavLink to="/login" activeClassName="active">ZALOGUJ SIĘ</NavLink></li>
                )}
            </ul>
        </header>
    );
};

export default Navbar;
