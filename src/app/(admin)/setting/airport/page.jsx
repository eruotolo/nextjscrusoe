import AirportTable from '@/components/Tables/Airport/AirportTable';
import { NewAirportModal } from '@/components/Modal/Airport/NewAirportModal';
export default function SettingAirportsPage() {
    return (
        <div className="grid grid-cols-1">
            <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                <div className="flex h-auto justify-between">
                    <div>
                        <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                            Listado de aeropuertos
                        </h5>
                        <p className="text-[13px] text-muted-foreground">
                            Crear, Editar y Eliminar
                        </p>
                    </div>
                    <div>
                        <NewAirportModal />
                    </div>
                </div>
                <div className="mt-[20px] flex">
                    <AirportTable />
                </div>
            </div>
        </div>
    );
}
