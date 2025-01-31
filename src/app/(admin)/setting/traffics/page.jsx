import TrafficsTable from '@/components/Tables/Setting/Traffics/TrafficsTable';
import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';

export default function Nombre() {
    return (
        <>
            <div>
                <BreadCrumbSetting title="Traffics" />
            </div>
            <div className="grid grid-cols-1">
                <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <TrafficsTable />
                </div>
            </div>
        </>
    );
}
