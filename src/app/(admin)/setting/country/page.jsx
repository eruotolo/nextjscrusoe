import CountryTable from '@/components/Tables/Setting/Country/CountryTable';
import CityTable from '@/components/Tables/Setting/Country/CityTable';
import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';

export default function SettingCountryPage() {
    return (
        <>
            <div>
                <BreadCrumbSetting title="Países y Ciudades" />
            </div>
            <div className="grid grid-cols-2">
                <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <CountryTable />
                </div>
                <div className="rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <CityTable />
                </div>
            </div>
        </>
    );
}
