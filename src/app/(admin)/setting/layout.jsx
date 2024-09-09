import MenuSettingInternal from '@/components/MenuSettingInternal/MenuSettingInternal';
import TitlePage from '@/components/TitlePages/TitlePage';
import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';
import { SettingProvider } from '@/context/SettingContext';

export default function DashboardLayout({ children }) {
    return (
        <SettingProvider>
            <section>
                <div className="mb-[30px]">
                    <TitlePage title="Configuración" />
                    <BreadCrumbSetting />
                </div>
                <div className="grid grid-cols-9 gap-4">
                    <div className="col-span-1">
                        <MenuSettingInternal />
                    </div>
                    <div className="col-span-8">{children}</div>
                </div>
            </section>
        </SettingProvider>
    );
}
