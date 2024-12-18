import MenuSettingInternal from '@/components/MenuSettingInternal/MenuSettingInternal';
import TitlePage from '@/components/TitlePages/TitlePage';
import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';
import { Settings } from 'lucide-react';

export default function DashboardLayout({ children }) {
    return (
        <section>
            <div className="mb-[30px] flex h-[40px] items-center">
                <Settings className="mb-[10px] mr-[10px] h-[20px] w-[20px]" />
                <TitlePage title="Configuración" />
            </div>
            <div className="grid grid-cols-9 gap-4">
                <div className="col-span-2 xl:col-span-1">
                    <MenuSettingInternal />
                </div>
                <div className="col-span-7 auto-rows-auto xl:col-span-8">{children}</div>
            </div>
        </section>
    );
}
