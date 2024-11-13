'use client';

import { create } from 'zustand';

const useAuthStore = create((set) => ({
    session: null,
    setSession: (session) => set({ session }),
    fetchSession: async () => {
        try {
            const response = await fetch('/api/auth/session');
            const data = await response.json();
            //console.log('Fetched session:', data); // Log para depuración
            set({ session: data });
        } catch (error) {
            console.error('Failed to fetch session:', error);
        }
    },
}));

export default useAuthStore;
