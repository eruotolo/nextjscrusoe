'use client';

import { useEffect, useState } from 'react';
import { useSettingContext } from '@/context/SettingContext';
import { getCountries } from '@/services/countryService';
import { createAirport } from '@/services/airportService';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function NewAirportModal() {
    const { refreshAirport } = useSettingContext();
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    const [airportCode, setAirportCode] = useState('');
    const [airportName, setAirportName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
        };
        fetchCountries();
    }, []);

    const handleCreateAirport = async (e) => {
        e.preventDefault();
        const airportData = {
            code: airportCode,
            name: airportName,
            codeCountry: selectedCountry,
            latitude: latitude,
            longitude: longitude,
        };
        const createdAirport = await createAirport(airportData);
        if (createdAirport) {
            refreshAirport();
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Airport</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo airport que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateAirport}>
                    <div className="grid grid-cols-2">
                        <div className="col-span-1 pr-[10px]">
                            <div className="mb-[15px] grid grid-cols-1">
                                <Select
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                    value={selectedCountry}
                                    onValueChange={setSelectedCountry}
                                >
                                    <SelectTrigger className="w-full border-0 bg-grisclaro text-[#8D8989]">
                                        <SelectValue placeholder="Seleccionar el País" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>País</SelectLabel>
                                            {countries.map((country) => (
                                                <SelectItem key={country.code} value={country.code}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <Input
                                    text="text"
                                    value={airportCode}
                                    onChange={(e) => setAirportCode(e.target.value)}
                                    placeholder="Codigo del airport"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                />
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <Input
                                    text="text"
                                    value={airportName}
                                    onChange={(e) => setAirportName(e.target.value)}
                                    placeholder="Nombre del airport"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                />
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <Input
                                    text="text"
                                    vale={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    placeholder="Ingresar Latitud"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                />
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <Input
                                    text="text"
                                    vale={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    placeholder="Ingresar Longitud"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                />
                            </div>
                        </div>
                        <div className="col-span-1 pl-[10px]">2</div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                            >
                                Crear Airport
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
