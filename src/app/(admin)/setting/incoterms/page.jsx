import TransportTypeTable from '@/components/Tables/TransportType/TransportTypeTable';
import IncotermsTable from '@/components/Tables/Incoterms/IncotermsTable';
export default function IncotermsPage() {
    return (
        <>
            <div className="grid grid-cols-3">
                <div className="col-span-2 mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <IncotermsTable />
                </div>
                <div className="col-span-1 rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <TransportTypeTable />
                </div>
            </div>
        </>
    );
}
