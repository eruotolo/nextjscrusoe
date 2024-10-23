'use client';

import { useEffect, useState } from 'react';
import { getCountries } from '@/services/countryService';
import { createShippingPort } from '@/services/shippingPortService';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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

export default function NewShippingPortModal({ open, onClose, refresh }) {
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
            onClose();
        } else {
            console.error('No se pudo crear el puerto. Por favor, intente nuevamente.');
        }
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
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Puerto</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo puerto que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateShippingPort}>
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
                            value={shippingPortunCode}
                            onChange={(e) => setShippingPortunCode(e.target.value)}
                            placeholder="Codigo del puerto"
                            className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                        />
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Input
                            type="text"
                            value={shippingPortName}
                            onChange={(e) => setShippingPortName(e.target.value)}
                            placeholder="Nombre del puerto"
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
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                disabled={!isFormValid()}
                                className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                            >
                                Crear Puerto
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
