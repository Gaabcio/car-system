export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token; // Jeśli token istnieje, zwraca true
};

export const logout = () => {
    localStorage.removeItem('authToken'); // Usuwamy token
};
