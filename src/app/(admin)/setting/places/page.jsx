import PlacesTable from '@/components/Tables/Places/PlacesTable';

export default function SettingPlacesPage() {
    return (
        <div className="grid grid-cols-1">
            <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                <PlacesTable />
            </div>
        </div>
    );
}
