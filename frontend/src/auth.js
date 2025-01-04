export const isAuthenticated = () => {
    const token = sessionStorage.getItem('authToken');
    return !!token; // Jeśli token istnieje, zwraca true
};

export const logout = () => {
    sessionStorage.removeItem('authToken'); // Usuwamy token
};
