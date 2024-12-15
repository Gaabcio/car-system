import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <header className={`navbar ${scrolled ? 'shrink' : ''}`}>
            <div className="logo">
                <img src={logo} alt="Logo" className="logo-icon" />
                <NavLink to="/" className="logo-text">System Zarządzania Pojazdami</NavLink>
            </div>
            <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            <ul className={`navbar-navItems ${menuOpen ? 'active' : ''}`}>
                <li><NavLink to="/" exact activeClassName="active">STRONA GŁÓWNA</NavLink></li>
                <li><NavLink to="/login" activeClassName="active">ZALOGUJ SIĘ</NavLink></li>
            </ul>
        </header>
    );
};

export default Navbar;
