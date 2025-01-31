import ShippingPortTable from '@/components/Tables/Setting/ShippingPorts/ShippingPortTable';
import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';
export default function SettingPortsPage() {
    return (
        <>
            <div>
                <BreadCrumbSetting title="Puertos" />
            </div>
            <div className="grid grid-cols-1">
                <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <ShippingPortTable />
                </div>
            </div>
        </>
    );
}
