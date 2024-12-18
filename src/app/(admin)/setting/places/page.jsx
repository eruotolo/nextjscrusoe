import PlacesTable from '@/components/Tables/Places/PlacesTable';
import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';

export default function SettingPlacesPage() {
    return (
        <>
            <div>
                <BreadCrumbSetting title="Lugares" />
            </div>
            <div className="grid grid-cols-1">
                <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <PlacesTable />
                </div>
            </div>
        </>
    );
}
