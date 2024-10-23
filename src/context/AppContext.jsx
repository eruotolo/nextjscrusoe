'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                const data = await response.json();
                console.log('Fetched session:', data); // Log para depuración
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
