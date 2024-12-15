// PrivateRoute.jsx
import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { isAuthenticated } from '../auth.js';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Routes>
        <Route
            {...rest}
            element={isAuthenticated() ? <Component /> : <Navigate to="/login" />}
        />
    </Routes>
);

export default PrivateRoute;