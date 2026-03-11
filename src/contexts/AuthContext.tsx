"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

import { loginUser, signupUser } from '@/app/actions/auth';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'customer' | 'admin';
    plan?: string;
    isPaid: boolean;
    billingDate?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('airlink_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const result = await loginUser(email, password);
            if (result.success && result.user) {
                const loggedInUser: User = {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name,
                    role: result.user.role as 'customer' | 'admin',
                    plan: result.user.plan || undefined,
                    isPaid: result.user.isPaid,
                    billingDate: result.user.billingDate || undefined,
                };
                setUser(loggedInUser);
                localStorage.setItem('airlink_user', JSON.stringify(loggedInUser));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const signup = async (email: string, password: string, name: string): Promise<boolean> => {
        try {
            const result = await signupUser(email, password, name);
            if (result.success && result.user) {
                const newUser: User = {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name,
                    role: result.user.role as 'customer' | 'admin',
                    isPaid: result.user.isPaid,
                };
                setUser(newUser);
                localStorage.setItem('airlink_user', JSON.stringify(newUser));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Signup error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('airlink_user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'admin',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
