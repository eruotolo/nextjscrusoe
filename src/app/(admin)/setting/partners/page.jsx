import PartnerTable from '@/components/Tables/Setting/Partner/partnerTable';
import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';

export default function Partner() {
    return (
        <>
            <div>
                <BreadCrumbSetting title="Partnes" />
            </div>
            <div className="grid grid-cols-1">
                <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <PartnerTable />
                </div>
            </div>
        </>
    );
}
