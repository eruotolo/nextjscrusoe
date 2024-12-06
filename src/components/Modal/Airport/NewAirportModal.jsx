'use client';

import { useEffect, useState } from 'react';

import { getCountries } from '@/services/setting/countryService';
import { createAirport } from '@/services/setting/airportService';
import { MapsComponent } from '@/components/Maps/MapsComponent';

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

import { Plus } from 'lucide-react';

export function NewAirportModal({ refresh }) {
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
            gcdiata: airportCode,
            name: airportName,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            codeCountry: selectedCountry,
        };
        const createdAirport = await createAirport(airportData);
        if (createdAirport) {
            await refresh();
            resetForm();
        }
    };

    const handleLocationChange = (lng, lat) => {
        setLongitude(lng);
        setLatitude(lat);
    };

    const resetForm = () => {
        setSelectedCountry('');
        setAirportName('');
        setAirportCode('');
        setLatitude('');
        setLongitude('');
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
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="custom-select"
                                >
                                    <option value="" disabled>
                                        Seleccionar el País
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
                                    value={airportCode}
                                    onChange={(e) => setAirportCode(e.target.value)}
                                    placeholder="Codigo del airport"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <input
                                    type="text"
                                    value={airportName}
                                    onChange={(e) => setAirportName(e.target.value)}
                                    placeholder="Nombre del airport"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <input
                                    type="number"
                                    step="any"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    placeholder="Ingresar Latitud"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <input
                                    type="number"
                                    step="any"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    placeholder="Ingresar Longitud"
                                    className="custom-input"
                                />
                            </div>
                        </div>
                        <div className="col-span-1 pl-[10px]">
                            <MapsComponent
                                lat={latitude}
                                lng={longitude}
                                onLocationChange={handleLocationChange}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <button type="submit" className="custom-button">
                                Crear Airport
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
