'use client';

import { useEffect } from 'react';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import useAuthStore from '@/store/authStore';
import SessionMonitor from '@/components/SessionMonitor/SessionMonitor';

export default function DashboardLayout({ children }) {
    const fetchSession = useAuthStore((state) => state.fetchSession);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    return (
        <>
            <SessionMonitor />
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-[#ffffff] md:block">
                    <Sidebar />
                </div>
                <div className="flex flex-col">
                    <Header />
                    <main className="mail-global flex flex-1 flex-col gap-4 bg-muted/40 px-[30px] py-[20px]">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
