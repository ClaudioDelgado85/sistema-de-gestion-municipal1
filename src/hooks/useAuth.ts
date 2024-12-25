import { useState, useEffect } from 'react';
import { User, LoginCredentials } from '../types/api';
import { authService } from '../services/api';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            setError(null);
            const userData = await authService.login(credentials);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (err) {
            setError('Error al iniciar sesión');
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
    };
}
