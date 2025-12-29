import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

// Create axios instance with base URL
// Use environment variable or default to localhost
let environmentURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Remove trailing slash if present
if (environmentURL.endsWith('/')) {
    environmentURL = environmentURL.slice(0, -1);
}

// Ensure it ends with /api (unless it already does)
// This handles cases where user provides "https://server.app" instead of "https://server.app/api"
if (!environmentURL.endsWith('/api')) {
    environmentURL += '/api';
}

const baseURL = environmentURL;

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists in localStorage (fallback for some flows, though cookies are primary)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(`API Error [${error.response.status}] ${error.config.url}:`, error.response.data);

            // Server responded with error code
            if (error.response.status === 401) {
                // Unauthorized - clear session but DO NOT hard reload
                // This prevents infinite loops and clearing console logs
                localStorage.removeItem('token');

                // We dispatch a custom event so the UI can react without a hard reload
                window.dispatchEvent(new Event('auth:unauthorized'));

                if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                    // Let the React Router handle redirection via state change, or manual push if needed
                    // But for now, we just ensure the token is gone.
                }
            } else if (error.response.status >= 500) {
                // toast.error('Server error. Please try again later.'); // Optional: reduce noise
            }
        } else if (error.request) {
            console.error('Network Error:', error.request);
            // toast.error('Network error. Check your connection.');
        }
        return Promise.reject(error);
    }
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const { data } = await api.get('/notifications');
            const unread = data.data.filter(n => !n.isRead).length;
            setUnreadNotifications(unread);
        } catch (error) {
            console.error('Failed to fetch notifications count');
        }
    };

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const { data } = await api.get('/auth/me'); // Endpoint to get current user
                setUser(data.data);
                fetchUnreadCount();
            } catch (error) {
                // Not logged in or token expired
                console.warn('Check user failed (usually normal if not logged in):', error);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        // Listen for 401 events from axios interceptor
        const handleUnauthorized = () => {
            setUser(null);
            setUnreadNotifications(0);
            toast.error('Session expired. Please login again.');
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);

        const token = localStorage.getItem('token');
        if (token) {
            checkUserLoggedIn();
        } else {
            setLoading(false);
        }

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, []);

    // Also poll for notifications if user is logged in
    useEffect(() => {
        if (!user) return;

        fetchUnreadCount(); // Initial fetch on login
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [user]);

    // Register User
    const register = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            localStorage.setItem('token', data.token); // Save token
            setUser(data.user);
            toast.success('Registration successful!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    // Login User
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            toast.success('Login successful!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    // Logout User
    const logout = async () => {
        try {
            await api.get('/auth/logout');
            localStorage.removeItem('token');
            setUser(null);
            setUnreadNotifications(0);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error(error);
            // Force logout on client content
            localStorage.removeItem('token');
            setUser(null);
            setUnreadNotifications(0);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, api, unreadNotifications, fetchUnreadCount }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
