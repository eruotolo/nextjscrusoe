import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import { AppProvider } from '@/context/AppContext';

export default function DashboardLayout({ children }) {
    return (
        <AppProvider>
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
        </AppProvider>
    );
}
