import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';

export default function PartnerDetail({ params }) {
    return (
        <>
            <div>
                <BreadCrumbSetting title="Partner" />
            </div>
            <div className="grid grid-cols-2">
                <div className="col-span-1 mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <h1>Detalles del Socio</h1>
                    <p>ID del Socio: {params.partnerId}</p>
                </div>
                <div className="col-span-1">
                    <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg"></div>
                    <div className="mr-[15px] mt-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg"></div>
                </div>
            </div>
        </>
    );
}
