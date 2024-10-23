'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { getCountries } from '@/services/countryService';
import { getShippingPortById, updateShippingPort } from '@/services/shippingPortService';
import { MapsComponent } from '@/components/Maps/MapsComponent';

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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function EditShippingPortModal({ id, refresh, open, onClose }) {
    const [countries, setCountries] = useState([]);
    const [countryName, setCountryName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
        };
        fetchCountries();
    }, []);

    //console.log('ID recibido en EditShippingPortModal:', id);

    useEffect(() => {
        const fetchShippingPort = async () => {
            if (id) {
                const shippingPortsData = await getShippingPortById(id);
                if (shippingPortsData) {
                    setValue('unCode', shippingPortsData.unCode);
                    setValue('name', shippingPortsData.name);
                    setValue('latitude', shippingPortsData.latitude);
                    setValue('longitude', shippingPortsData.longitude);
                    setValue('codeCountry', shippingPortsData.codeCountry);

                    setLatitude(shippingPortsData.latitude);
                    setLongitude(shippingPortsData.longitude);

                    // Buscar el nombre del país
                    const country = countries.find((c) => c.code === shippingPortsData.codeCountry);
                    setCountryName(country ? country.name : '');
                }
            }
        };
        fetchShippingPort();
    }, [id, setValue, countries]);

    // Observar cambios en los campos de latitud y longitud
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'latitude') setLatitude(value.latitude);
            if (name === 'longitude') setLongitude(value.longitude);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const upShippingPort = await updateShippingPort(id, {
                ...data,
                countryName: countryName,
            });
            if (upShippingPort) {
                await refresh();
                onClose();
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
                                <Label
                                    htmlFor="text"
                                    className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Nombre del País
                                </Label>
                                <Input
                                    type="text"
                                    className="mb-2 rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                    value={countryName}
                                    readOnly
                                    placeholder="Nombre del país"
                                />
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <Label
                                    htmlFor="text"
                                    className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Código del Puerto
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Código del Puerto"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                    {...register('unCode', { required: true })}
                                />
                                {errors.unCode && <span>Este campo es requerido</span>}
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <Label
                                    htmlFor="text"
                                    className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Nombre del Puerto
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Nombre del puerto"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                    {...register('name', { required: true })}
                                />
                                {errors.name && <span>Este campo es requerido</span>}
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <Label
                                    htmlFor="text"
                                    className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Latitud
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Ingresar Latitud"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                    {...register('latitude', { required: true })}
                                />
                                {errors.latitude && <span>Este campo es requerido</span>}
                            </div>
                            <div className="mb-[15px] grid grid-cols-1">
                                <Label
                                    htmlFor="text"
                                    className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Longitud
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Ingresar Longitud"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                    {...register('longitude', { required: true })}
                                />
                                {errors.longitude && <span>Este campo es requerido</span>}
                            </div>
                        </div>
                        <div className="">
                            {latitude && longitude && (
                                <MapsComponent
                                    lng={parseFloat(longitude)}
                                    lat={parseFloat(latitude)}
                                />
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                        >
                            Actualizar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
