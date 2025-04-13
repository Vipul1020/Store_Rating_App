import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error("AuthProvider: Failed to parse user from localStorage", error);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return data;
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            throw error.response?.data || new Error("Login failed");
        }
    }, []);

    const signup = useCallback(async (name, email, password, address) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password, address });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return data;
        } catch (error) {
            console.error("Signup failed:", error.response?.data || error.message);
            throw error.response?.data || new Error("Signup failed");
        }
    }, []);


    const logout = useCallback(() => {
        localStorage.removeItem('user');
        setUser(null);
    }, []);

    const changePassword = useCallback(async (newPassword) => {
         try {
            const { data } = await api.put('/auth/change-password', { newPassword });
            return data;
        } catch (error) {
            console.error("Change Password failed:", error.response?.data || error.message);
            throw error.response?.data || new Error("Password change failed");
        }
    }, []);

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStoreOwner: user?.role === 'store_owner',
        isNormalUser: user?.role === 'normal',
        loading,
        login,
        signup,
        logout,
        changePassword
    }), [user, loading, login, signup, logout, changePassword]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};