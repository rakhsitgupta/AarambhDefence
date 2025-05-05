import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ApiService from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }

            const response = await ApiService.validateToken();
            if (response.valid) {
                setIsAuthenticated(true);
                setUser(response.user);
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (credentials) => {
        try {
            setLoading(true);
            const response = await ApiService.login(credentials);
            localStorage.setItem('token', response.token);
            setIsAuthenticated(true);
            setUser(response.user);
            toast.success('Login successful');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Login failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const handleRegister = async (userData) => {
        try {
            setLoading(true);
            const response = await ApiService.register(userData);
            localStorage.setItem('token', response.token);
            setIsAuthenticated(true);
            setUser(response.user);
            toast.success('Registration successful');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Registration failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = async (userData) => {
        try {
            setLoading(true);
            const updatedUser = await ApiService.updateProfile(userData);
            setUser(updatedUser);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        updateProfile: updateUserProfile
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 