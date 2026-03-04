import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken } from '../services/api';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const token = localStorage.getItem('stayos_admin_token');
            const storedUser = localStorage.getItem('stayos_admin_user');

            if (token && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                    setAuthToken(token);
                } catch {
                    localStorage.removeItem('stayos_admin_token');
                    localStorage.removeItem('stayos_admin_user');
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('stayos_admin_token', token);
        localStorage.setItem('stayos_admin_user', JSON.stringify(userData));
        setAuthToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('stayos_admin_token');
        localStorage.removeItem('stayos_admin_user');
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
