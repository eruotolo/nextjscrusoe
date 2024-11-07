import AirportTable from '@/components/Tables/Airport/AirportTable';

export default function SettingAirportsPage() {
    return (
        <div className="grid grid-cols-1">
            <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                <AirportTable />
            </div>
        </div>
    );
}
