'use client';

import { useEffect, useState } from 'react';

import { getCountries } from '@/services/countryService';
import { getCitiesCountry, getCityById } from '@/services/cityService';
import { createPlaces } from '@/services/placesService';
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

export default function NewPlacesModal({ refresh }) {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

    const [placesName, setPlacesName] = useState('');
    const [placesAddress, setPlacesAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (selectedCountry) {
                const cityData = await getCitiesCountry(selectedCountry);
                setCities(cityData);
                setSelectedCity(''); // Resetea la ciudad seleccionada cuando cambia el país
            } else {
                setCities([]);
                setSelectedCity(''); // Resetea la ciudad seleccionada si no hay país seleccionado
            }
        };
        fetchCities();
    }, [selectedCountry]);

    const handleCreatePlaces = async (e) => {
        e.preventDefault();
        const placesData = {
            codeCountry: selectedCountry,
            codeCity: parseInt(selectedCity, 10),
            name: placesName,
            address: placesAddress,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        };
        //console.log('Datos', placesData);
        const createdPlaces = await createPlaces(placesData);
        if (createdPlaces) {
            resetForm();
            await refresh();
        } else {
            console.error('No se pudo crear el lugar');
        }
    };

    const handleLocationChange = (lng, lat) => {
        setLongitude(lng);
        setLatitude(lat);
    };

    const resetForm = () => {
        setSelectedCountry('');
        setSelectedCity('');
        setPlacesName('');
        setPlacesAddress('');
        setLatitude('');
        setLongitude('');
    };

    const isFormValid = () => {
        return (
            selectedCountry && selectedCity && placesName && placesAddress && latitude && longitude
        );
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1100px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Lugar</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo lugar que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePlaces}>
                    <div className="grid grid-cols-2">
                        <div className="col-span-1 flex flex-col justify-center pr-[10px]">
                            <div className="mb-[15px] grid grid-cols-3">
                                <label
                                    htmlFor="name"
                                    className="col-span-1 mr-[10px] px-[15px] pt-[15px] text-[15px] font-light text-[#646464]"
                                >
                                    ASIGNAR PAÍS
                                </label>
                                <select
                                    id="country"
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="custom-select col-span-2"
                                >
                                    <option value="" disabled className="text-[15px] font-light">
                                        SELECCIONAR EL PAÍS
                                    </option>
                                    {countries.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-[15px] grid grid-cols-3">
                                <label
                                    htmlFor="name"
                                    className="col-span-1 mr-[10px] px-[15px] pt-[15px] text-[15px] font-light text-[#646464]"
                                >
                                    ASIGNAR CIUDAD
                                </label>
                                <select
                                    id="city"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="custom-select col-span-2"
                                >
                                    <option value="" disabled className="text-[15px] font-light">
                                        SELECCIONAR LA CIUDAD
                                    </option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    type="text"
                                    placeholder="Nombre del Lugar"
                                    value={placesName}
                                    onChange={(e) => setPlacesName(e.target.value)}
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    type="text"
                                    placeholder="Dirección"
                                    value={placesAddress}
                                    onChange={(e) => setPlacesAddress(e.target.value)}
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
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
                            <button
                                disabled={!isFormValid()}
                                type="submit"
                                className="custom-button"
                            >
                                Crear Lugar
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
