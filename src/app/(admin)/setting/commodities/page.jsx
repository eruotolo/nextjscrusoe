import CommoditiesSectionTable from '@/components/Tables/Setting/Commodities/CommoditiesSectionTable';
import CommoditiesTable from '@/components/Tables/Setting/Commodities/CommoditiesTable';
import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';
export default function CommoditiesPage() {
    return (
        <>
            <div>
                <BreadCrumbSetting title="Commodities" />
            </div>
            <div className="grid grid-cols-3">
                <div className="col-span-2 mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <CommoditiesTable />
                </div>
                <div className="col-span-1 rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <CommoditiesSectionTable />
                </div>
            </div>
        </>
    );
}
