'use client';

import { useEffect, useState } from 'react';

import { getCountries } from '@/services/setting/countryService';
import { createShippingPort } from '@/services/setting/shippingPortService';
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

export default function NewShippingPortModal({ refresh }) {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    const [shippingPortName, setShippingPortName] = useState('');
    const [shippingPortunCode, setShippingPortunCode] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
        };
        fetchCountries();
    }, []);

    const handleCreateShippingPort = async (e) => {
        e.preventDefault();
        const shippingPortData = {
            unCode: shippingPortunCode,
            name: shippingPortName,
            codeCountry: selectedCountry,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        };

        const createdShippingPort = await createShippingPort(shippingPortData);
        if (createdShippingPort) {
            resetForm();
            refresh();
        } else {
            console.error('No se pudo crear el puerto. Por favor, intente nuevamente.');
        }
    };

    const handleLocationChange = (lng, lat) => {
        setLongitude(lng);
        setLatitude(lat);
    };

    const resetForm = () => {
        setSelectedCountry('');
        setShippingPortName('');
        setShippingPortunCode('');
        setLatitude('');
        setLongitude('');
    };

    const isFormValid = () => {
        return selectedCountry && shippingPortName && shippingPortunCode && latitude && longitude;
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Puerto</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo puerto que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateShippingPort}>
                    <div className="grid grid-cols-2">
                        <div className="col-span-1 pr-[10px]">
                            <div className="mb-[15px] grid grid-cols-1">
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="custom-select"
                                >
                                    <option
                                        value=""
                                        disabled
                                        className="text-[14px] font-light text-muted-foreground"
                                    >
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
                                    value={shippingPortunCode}
                                    onChange={(e) => setShippingPortunCode(e.target.value)}
                                    placeholder="Codigo del puerto"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <input
                                    type="text"
                                    value={shippingPortName}
                                    onChange={(e) => setShippingPortName(e.target.value)}
                                    placeholder="Nombre del puerto"
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
                            <button
                                type="submit"
                                disabled={!isFormValid()}
                                className="custom-button disabled:opacity-50"
                            >
                                Crear Puerto
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
