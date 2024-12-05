'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import { getCountries } from '@/services/countryService';
import { getShippingPortById, updateShippingPort } from '@/services/shippingPortService';

import { EditMapsComponent } from '@/components/Maps/EditMapsComponents';

export default function EditShippingPortModal({ id, refresh, open, onClose }) {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchShippingPort = async () => {
            if (id) {
                const shippingPortsData = await getShippingPortById(id);
                if (shippingPortsData) {
                    setSelectedCountry(shippingPortsData.codeCountry);
                    setValue('unCode', shippingPortsData.unCode || '');
                    setValue('name', shippingPortsData.name || '');
                    setValue('latitude', shippingPortsData.latitude || '');
                    setValue('longitude', shippingPortsData.longitude || '');
                    setLatitude(shippingPortsData.latitude || '');
                    setLongitude(shippingPortsData.longitude || '');
                }
            }
        };
        if (open) {
            fetchShippingPort();
        }
    }, [id, open, setValue]);

    const handleLocationChange = (lng, lat) => {
        setLongitude(lng);
        setLatitude(lat);
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await updateShippingPort(id, {
                ...data,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                codeCountry: selectedCountry,
            });
            console.log(response);
            if (response) {
                await refresh();
                onClose();
            } else {
                console.error('No se pudo actualizar la data');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Editar Puerto</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados al puerto. Asegúrate de
                        que los cambios reflejen correctamente la información antes de guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-2">
                        <div className="col-span-1 pr-[15px]">
                            <div className="mb-[15px] grid grid-cols-1">
                                <select
                                    id="country"
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
                                <label
                                    htmlFor="unCode"
                                    className="px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Código del Puerto
                                </label>
                                <input
                                    type="text"
                                    id="unCode"
                                    placeholder="Código del Puerto"
                                    className="custom-input"
                                    {...register('unCode')}
                                />
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <label
                                    htmlFor="name"
                                    className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Nombre del Puerto
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Nombre del puerto"
                                    className="custom-input"
                                    {...register('name')}
                                />
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <label
                                    htmlFor="latitude"
                                    className="px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Latitud
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    id="latitude"
                                    className="custom-input"
                                    {...register('latitude')}
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                />
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <label
                                    htmlFor="longitude"
                                    className="px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Longitud
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    id="longitude"
                                    className="custom-input"
                                    {...register('longitude')}
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-span-1 pr-[10px]">
                            <EditMapsComponent
                                lat={latitude}
                                lng={longitude}
                                onLocationChange={handleLocationChange}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            type="submit"
                            className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                        >
                            Actualizar
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
