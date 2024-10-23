'use client';

import { useState, useEffect } from 'react';
import { useSettingContext } from '@/context/SettingContext';
import { Plus } from 'lucide-react';
import { getCountries } from '@/services/countryService'; // Asegúrate de tener esta función en tu servicio
import { createCity } from '@/services/cityService';

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
import { Input } from '@/components/ui/input';

export default function NewCityModal() {
    const { updateCities, updateCountries } = useSettingContext();
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
        const createdCity = await createCity(cityData); // Renamed variable to createdCity
        if (createdCity) {
            updateCities();
            updateCountries();
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Crear Nueva Ciudad</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre de la nueva ciudad que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCity}>
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
                            type="text"
                            placeholder="Nombre Ciudad"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                            >
                                Crear Ciudad
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
