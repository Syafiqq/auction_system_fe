'use client';

import React, {createContext, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import authRepository from "@/data/repository/auth-repository";
import {User} from "@/domain/definition/entity/user.definition";
import logoutUseCase from "@/domain/usecase/logout-use-case";

const AuthContext = createContext<{
    user: User | null;
    login: () => void;
    logout: () => void;
} | null>(null);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = authRepository.loadToken();

        if (!token) {
            router.push('/auth');
            setLoading(false);
            return;
        }

        const loadUserProfile = () => {
            try {
                const user = authRepository.loadProfile();
                if (user === null) {
                    router.push('/auth');
                } else {
                    setUser(user);
                }
            } catch (error) {
                router.push('/auth');
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [router]);

    const login = () => {
        const user = authRepository.loadProfile();
        if (user) {
            setUser(user);
        }
    };

    const logout = () => {
        logoutUseCase.execute()
        setUser(null);
        router.push('/auth');
    };

    if (loading) return <p>Loading...</p>;

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
