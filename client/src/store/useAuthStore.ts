import { create } from 'zustand';
import api from '@/lib/axios';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    login: (userData: object) => Promise<void>;
    signup: (userData: object) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    setUser: (user) => {
        set({ user });
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
    },
    setToken: (token) => {
        set({ token });
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    },
    login: async (credentials) => {
        const { data } = await api.post('/auth/login', credentials);
        set({ user: data, token: data.token });
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
    },
    signup: async (userData) => {
        const { data } = await api.post('/auth/signup', userData);
        set({ user: data, token: data.token });
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
    },
    logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },
}));
