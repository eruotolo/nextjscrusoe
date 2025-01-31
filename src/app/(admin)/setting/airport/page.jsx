import AirportTable from '@/components/Tables/Setting/Airport/AirportTable';
import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';

export default function SettingAirportsPage() {
    return (
        <>
            <div>
                <BreadCrumbSetting title="Aeropuertos" />
            </div>
            <div className="grid grid-cols-1">
                <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <AirportTable />
                </div>
            </div>
        </>
    );
}
