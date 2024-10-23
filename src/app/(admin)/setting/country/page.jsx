import CountryTable from '@/components/Tables/Country/CountryTable';
import CityTable from '@/components/Tables/Country/CityTable';
import NewCityModal from '@/components/Modal/Country/NewCityModal';
import NewCountryModal from '@/components/Modal/Country/NewCountryModal';

export default function SettingCountryPage() {
    return (
        <div className="grid grid-cols-2">
            <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                <div className="flex h-auto justify-between">
                    <div>
                        <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                            Listado de países
                        </h5>
                        <p className="text-[13px] text-muted-foreground">
                            Crear, Editar y Eliminar
                        </p>
                    </div>
                    <div>
                        <NewCountryModal />
                    </div>
                </div>
                <div className="mt-[20px] flex">
                    <CountryTable />
                </div>
            </div>
            <div className="rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                <div className="flex h-auto justify-between">
                    <div>
                        <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                            Listado de ciudades
                        </h5>
                        <p className="text-[13px] text-muted-foreground">
                            Crear, Editar y Eliminar
                        </p>
                    </div>
                    <div>
                        <NewCityModal />
                    </div>
                </div>
                <div className="mt-[20px] flex">
                    <CityTable />
                </div>
            </div>
        </div>
    );
}
