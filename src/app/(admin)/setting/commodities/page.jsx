import CommoditiesSectionTable from '@/components/Tables/Commodities/CommoditiesSectionTable';
import CommoditiesTable from '@/components/Tables/Commodities/CommoditiesTable';
export default function CommoditiesPage() {
    return (
        <>
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
