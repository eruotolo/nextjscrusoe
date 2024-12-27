'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { createPartner } from '@/services/setting/partnerService';
import { getCountries } from '@/services/setting/countryService';
import { getCitiesCountry } from '@/services/setting/cityService';
import useAuthStore from '@/store/authStore';

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
import { getPartnerType } from '@/services/setting/partnerTypeService';

export default function NewPartner({ refresh }) {
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
        formState: { errors, isValid },
        reset,
    } = useForm();

    // GET PARTNER TYPE
    useEffect(() => {
        const fetchPartnerType = async () => {
            const partnerTypeData = await getPartnerType();
            setPartnerType(partnerTypeData);
        };
        fetchPartnerType();
    }, []);

    // GET COUNTRY AND CITY
    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCodeCountry(countriesData);
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (selectedCountry) {
                const cityData = await getCitiesCountry(selectedCountry);
                setCodeCity(cityData);
                setSelectedCity(''); // Resetea la ciudad seleccionada cuando cambia el país
            } else {
                setCodeCity([]);
                setSelectedCity(''); // Resetea la ciudad seleccionada si no hay país seleccionado
            }
        };
        fetchCities();
    }, [selectedCountry]);

    // FUNCION ONSUBMIT
    const onSubmit = async (data) => {
        setError('');
        //console.log(data);
        // Transforma el id del usuario a un número
        data.userId = Number(session?.user?.id) || 0;
        try {
            const partnerData = {
                ...data,
                codeCountry: selectedCountry,
                codeCity: parseInt(selectedCity, 10),
            };

            const createdPartner = await createPartner(partnerData);
            //console.log('Datos Partner:', createdPartner);
            if (createdPartner) {
                await refresh();
                reset();
            }
        } catch (error) {
            setError('Error de red al crear');
            console.error('Error creating', error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Socio/Partner</DialogTitle>
                    <DialogDescription>
                        Introduce los datos del Nuevo Socio/Partner.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                        <input
                            type="hidden"
                            value={session?.user?.id || ''}
                            {...register('userId')}
                        />
                    </div>
                    {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                    <DialogFooter>
                        <DialogClose asChild>
                            <button type="submit" className="custom-button" disabled={!isValid}>
                                Crear Socio
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
