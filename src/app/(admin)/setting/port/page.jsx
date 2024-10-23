import ShippingPortTable from '@/components/Tables/ShippingPorts/ShippingPortTable';
export default function SettingPortsPage() {
    return (
        <div className="grid grid-cols-1">
            <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                <ShippingPortTable />
            </div>
        </div>
    );
}
