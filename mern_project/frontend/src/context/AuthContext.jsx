import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        return storedUserInfo ? JSON.parse(storedUserInfo) : null;
    });

    const [isAdmin, setIsAdmin] = useState(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (!storedUserInfo) return false;
        try {
            return JSON.parse(storedUserInfo).isAdmin || false;
        } catch {
            return false;
        }
    });

    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
        setIsAdmin(userData.isAdmin || false);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
