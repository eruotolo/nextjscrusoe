// store/sessionStore.js
import { create } from 'zustand';
import { signOut } from 'next-auth/react';

const INACTIVITY_TIME = 20 * 60 * 1000; // 20 minutos

const useSessionStore = create((set, get) => ({
    timeoutId: null,

    resetTimer: () => {
        const { timeoutId } = get();
        if (timeoutId) clearTimeout(timeoutId);

        const newTimeoutId = setTimeout(() => {
            signOut({ redirect: true, callbackUrl: '/login' });
        }, INACTIVITY_TIME);

        set({ timeoutId: newTimeoutId });
    },

    startMonitoring: () => {
        const { resetTimer } = get();
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        events.forEach((event) => {
            document.addEventListener(event, resetTimer);
        });
        resetTimer();
    },

    stopMonitoring: () => {
        const { resetTimer, timeoutId } = get();
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        events.forEach((event) => {
            document.removeEventListener(event, resetTimer);
        });

        if (timeoutId) clearTimeout(timeoutId);
    },
}));

export default useSessionStore;
