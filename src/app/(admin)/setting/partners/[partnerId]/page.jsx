import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';
import UniquePartner from '@/components/Partner/uniquePartner';
import ContactTable from '@/components/Tables/Contact/ContactTable';

export default function PartnerDetail({ params }) {
    return (
        <>
            <div>
                <BreadCrumbSetting title="Partner" />
            </div>
            <div className="grid grid-cols-2">
                <div className="col-span-1 mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <UniquePartner id={params.partnerId} />
                </div>
                <div className="col-span-1">
                    <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                        <ContactTable id={params.partnerId} />
                    </div>
                    <div className="mr-[15px] mt-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg"></div>
                </div>
            </div>
        </>
    );
}
