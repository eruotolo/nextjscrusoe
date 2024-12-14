import TrafficsTable from '@/components/Tables/Traffics/TrafficsTable';

export default function Nombre() {
    return (
        <div className="grid grid-cols-1">
            <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                <TrafficsTable />
            </div>
        </div>
    );
}
