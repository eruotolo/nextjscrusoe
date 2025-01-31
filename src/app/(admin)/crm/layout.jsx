import TitlePage from '@/components/TitlePages/TitlePage';
import { ArrowUpNarrowWide } from 'lucide-react';

export default function DashboardLayout({ children }) {
    return (
        <section>
            <div className="mb-[30px] flex h-[40px] items-center">
                <ArrowUpNarrowWide className="mb-[10px] mr-[10px] h-[20px] w-[20px]" />
                <TitlePage title="CRM" />
            </div>
            <div className="grid grid-cols-9 gap-4">{children}</div>
        </section>
    );
}
