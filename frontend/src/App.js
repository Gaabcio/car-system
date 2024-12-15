// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from "./components/Dashboard";
import { isAuthenticated } from './auth';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <div className="app-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        {/*<Route path="/dashboard" element={<Dashboard />} /> /!*bez tokenu*!/*/}
                        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} /> {/*z tokenem*/}
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
