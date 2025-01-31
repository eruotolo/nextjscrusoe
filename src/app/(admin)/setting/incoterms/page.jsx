import TransportTypeTable from '@/components/Tables/Setting/TransportType/TransportTypeTable';
import IncotermsTable from '@/components/Tables/Setting/Incoterms/IncotermsTable';
import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';
export default function IncotermsPage() {
    return (
        <>
            <div>
                <BreadCrumbSetting title="Incoterms" />
            </div>
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
