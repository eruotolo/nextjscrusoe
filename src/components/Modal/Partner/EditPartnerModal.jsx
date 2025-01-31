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

import { getCountries } from '@/services/setting/countryService';
import { getCitiesCountry } from '@/services/setting/cityService';
import { getPartnerById, updatePartner } from '@/services/setting/partnerService';
import { getPartnerType } from '@/services/setting/partnerTypeService';
import useAuthStore from '@/store/authStore';

export default function EditPartnerModal({ id, refresh, open, onClose }) {
    const session = useAuthStore((state) => state.session);
    const [error, setError] = useState('');

    const [partnerType, setPartnerType] = useState([]);

    const [codeCountry, setCodeCountry] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    const [codeCity, setCodeCity] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // GET PARTNER TYPE
    useEffect(() => {
        const fetchPartnerType = async () => {
            const partnerTypeData = await getPartnerType();
            setPartnerType(partnerTypeData);
        };
        fetchPartnerType();
    }, []);

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCodeCountry(countriesData);
        };
        fetchCountries();
    }, []);

    // Cargar las ciudades cuando cambia el país seleccionado
    useEffect(() => {
        const fetchCities = async () => {
            if (selectedCountry) {
                const cityData = await getCitiesCountry(selectedCountry);
                setCodeCity(cityData);

                if (!id) {
                    setSelectedCity('');
                }
            } else {
                setCodeCity([]);
                setSelectedCity('');
            }
        };
        fetchCities();
    }, [selectedCountry, id]);

    useEffect(() => {
        const fecthPartner = async () => {
            if (id) {
                const partnerData = await getPartnerById(id);
                if (partnerData) {
                    setSelectedCountry(partnerData.codeCountry);
                    const cityData = await getCitiesCountry(partnerData.codeCountry);
                    setCodeCity(cityData);
                    setSelectedCity(partnerData.codeCity);

                    setValue('partnerTypeId', partnerData.partnerTypeId || '');
                    setValue('name', partnerData.name || '');
                    setValue('socialReazon', partnerData.socialReazon || '');
                    setValue('rut', partnerData.rut || '');
                    setValue('taxId', partnerData.taxId || '');
                    setValue('scacCode', partnerData.scacCode || '');
                    setValue('email', partnerData.email || '');
                    setValue('phone', partnerData.phone || '');
                    setValue('address', partnerData.address || '');
                    setValue('zipCode', partnerData.zipCode || '');
                    setValue('locations', partnerData.locations || '');
                    setValue('userId', partnerData.userId || '');
                }
            }
        };

        if (open) {
            fecthPartner();
        }
    }, [id, open, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await updatePartner(id, {
                ...data,
                codeCountry: selectedCountry,
                codeCity: selectedCity,
                userId: session?.user?.id || '',
            });
            //console.log('Update:', response);
            if (response) {
                await refresh();
                onClose();
            } else {
                console.error('Error submitting form:', error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Editar Socio/Partner</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados al Partnes/Socio.
                        Asegúrate de que los cambios reflejen correctamente la información antes de
                        guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="mb-[15px]">
                        <select
                            id="partnerTypeId"
                            {...register('partnerTypeId', { required: true })}
                            className="custom-select"
                            defaultValue=""
                        >
                            <option
                                value=""
                                disabled
                                className="text-[14px] font-light text-muted-foreground"
                            >
                                Seleccionar El Tipo de Socio
                            </option>
                            {partnerType.map((supplier) => (
                                <option value={supplier.id} key={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-[15px]"></div>
                    <div className="mb-[15px] grid grid-cols-2 gap-4">
                        <div>
                            <input
                                id="name"
                                type="text"
                                placeholder="Nombre"
                                className="custom-input"
                                {...register('name', {
                                    required: 'El nombre del Socio es requerido',
                                })}
                            />
                        </div>
                        <div>
                            <input
                                id="socialReazon"
                                type="text"
                                placeholder="Razón Social"
                                className="custom-input"
                                {...register('socialReazon', {
                                    required: 'La razón social es requerida',
                                })}
                            />
                        </div>
                        <div>
                            <input
                                id="rut"
                                type="text"
                                placeholder="RUT"
                                className="custom-input"
                                {...register('rut', { required: 'El RUT es requerido' })}
                            />
                        </div>
                        <div>
                            <input
                                id="taxId"
                                type="text"
                                placeholder="TaxID"
                                className="custom-input"
                                {...register('taxId')}
                            />
                        </div>
                        <div>
                            <input
                                id="scacCode"
                                type="text"
                                placeholder="SCAC Código"
                                className="custom-input"
                                {...register('scacCode')}
                            />
                        </div>
                        <div>
                            <input
                                id="phone"
                                type="text"
                                placeholder="Teléfono"
                                className="custom-input"
                                {...register('phone')}
                            />
                        </div>
                    </div>
                    <div className="mb-[15px]">
                        <input
                            id="email"
                            type="email"
                            placeholder="Correo Electrónico"
                            className="custom-input"
                            {...register('email', {
                                required: 'El email es requerido',
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Email inválido',
                                },
                            })}
                        />
                    </div>
                    <div className="mb-[15px] grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <input
                                id="address"
                                type="text"
                                placeholder="Dirección"
                                className="custom-input"
                                {...register('address')}
                            />
                        </div>
                        <div className="col-span-1">
                            <input
                                id="zipCode"
                                type="text"
                                placeholder="Código Postal"
                                className="custom-input"
                                {...register('zipCode')}
                            />
                        </div>
                    </div>
                    <div className="mb-[15px]">
                        <input
                            id="locations"
                            type="text"
                            placeholder="Localidad"
                            className="custom-input"
                            {...register('locations')}
                        />
                    </div>
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
                            <option
                                value=""
                                disabled
                                className="text-[14px] font-light text-muted-foreground"
                            >
                                Seleccionar el país
                            </option>
                            {codeCountry.map((country) => (
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
                            <option
                                value=""
                                disabled
                                className="text-[14px] font-light text-muted-foreground"
                            >
                                Seleccionar la ciudad
                            </option>
                            {codeCity.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input type="text" hidden {...register('userId')} />
                    </div>
                    {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                    <DialogFooter>
                        <button type="submit" className="custom-button">
                            Actualizar
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
