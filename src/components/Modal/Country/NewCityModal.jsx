'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getCountries } from '@/services/setting/countryService'; // Asegúrate de tener esta función en tu servicio
import { createCity } from '@/services/setting/cityService';

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

export default function NewCityModal({ refresh }) {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [cityName, setCityName] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
        };
        fetchCountries();
    }, []);

    const handleCreateCity = async (e) => {
        e.preventDefault();
        const cityData = {
            countryCode: selectedCountry,
            name: cityName,
        };
        const createdCity = await createCity(cityData);
        if (createdCity) {
            await refresh();
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Nueva Ciudad</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre de la nueva ciudad que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCity}>
                    <div className="mb-[15px] grid grid-cols-3">
                        <label
                            htmlFor="name"
                            className="col-span-1 mr-[10px] px-[15px] pt-[15px] text-[15px] font-light text-[#646464]"
                        >
                            ASIGNAR PAIS
                        </label>
                        <select
                            id="country"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="custom-select col-span-2"
                        >
                            <option
                                value=""
                                disabled
                                className="text-[14px] font-light text-muted-foreground"
                            >
                                Seleccionar el país
                            </option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            type="text"
                            placeholder="Nombre Ciudad"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            className="custom-input"
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <button type="submit" className="custom-button">
                                Crear Ciudad
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
