import CountryTable from '@/components/Tables/Country/CountryTable';
import CityTable from '@/components/Tables/Country/CityTable';

export default function SettingCountryPage() {
    return (
        <div className="grid grid-cols-2">
            <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                <CountryTable />
            </div>
            <div className="rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                <CityTable />
            </div>
        </div>
    );
}
