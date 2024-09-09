'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Información de Sessión Usuario Logueado
    const [session, setSession] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                const data = await response.json();
                setSession(data);
            } catch (error) {
                console.error('Failed to fetch session:', error);
            }
        };
        fetchSession();
    }, []);

    return <AppContext.Provider value={session}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
