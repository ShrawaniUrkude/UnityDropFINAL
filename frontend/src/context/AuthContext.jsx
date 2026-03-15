import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import { getHomeRouteForRole } from '../utils/authRoutes';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
    token: 'token',
    user: 'unitydrop_user',
};

function readStoredUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.user);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => readStoredUser());
    const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token) || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            localStorage.setItem(STORAGE_KEYS.token, token);
        } else {
            localStorage.removeItem(STORAGE_KEYS.token);
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEYS.user);
        }
    }, [user]);

    const setSession = (sessionUser, sessionToken) => {
        setUser(sessionUser);
        setToken(sessionToken);
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await authAPI.login(credentials);
            setSession(response.data, response.data.token);
            return response.data;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await authAPI.register(userData);
            setSession(response.data, response.data.token);
            return response.data;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch {
            // Ignore logout acknowledgement failures and always clear local session.
        }
        setUser(null);
        setToken('');
    };

    const getHomeRoute = (role) => getHomeRouteForRole(role);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: Boolean(user && token),
                login,
                register,
                logout,
                getHomeRoute,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
