// auth.js
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Możesz dodać dodatkowe sprawdzenie ważności tokena tutaj
    return true;
};