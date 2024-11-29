import ShipOwnerTable from '@/components/Tables/Ships/ShipOwnerTable';
import ShipsTable from '@/components/Tables/Ships/ShipsTable';

export default function Ships() {
    return (
        <>
            <div className="grid grid-cols-3">
                <div className="col-span-2 mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <ShipsTable />
                </div>
                <div className="col-span-1 rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <ShipOwnerTable />
                </div>
            </div>
        </>
    );
}
