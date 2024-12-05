'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { getCountries } from '@/services/countryService';
import { getShipOwner } from '@/services/shipOwnerService';
import { getShipsType } from '@/services/shipsTypeService';
import { createShips } from '@/services/shipsService';

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

export default function NewShips({ refresh }) {
    const [countries, setCountries] = useState([]);
    const [shipOwner, setShipOwner] = useState([]);
    const [shipsType, setShipsType] = useState([]);
    const [error, setError] = useState('');

    const [shipsName, setShipsName] = useState('');
    const [shipsCode, setShipsCode] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [countriesData, shipOwnerData, shipsTypeData] = await Promise.all([
                    getCountries(),
                    getShipOwner(),
                    getShipsType(),
                ]);
                setCountries(countriesData);
                setShipOwner(shipOwnerData);
                setShipsType(shipsTypeData);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        setError('');
        try {
            const formattedData = {
                name: data.name,
                code: data.code,
                shipownerId: data.shipOwner,
                codeCountry: data.country,
                shipsTypeId: data.shipsType,
            };
            const createdShip = await createShips(formattedData);
            // console.log('Datos:', createdShip);
            if (createdShip) {
                await refresh();
                reset();
            }
        } catch (error) {
            setError('Error de red al crear el barco');
            console.error('Error creating ship', error);
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
                    <DialogTitle>Crear Nuevo Barco</DialogTitle>
                    <DialogDescription>
                        Introduce los detalles del nuevo barco que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px]">
                        <label htmlFor="name">Nombre del Barco</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Nombre del Barco"
                            {...register('name', { required: true })}
                            className="custom-input"
                        />
                        {errors.name && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px]">
                        <label htmlFor="code">Código del Barco</label>
                        <input
                            id="code"
                            type="text"
                            placeholder="Código del Barco"
                            {...register('code', { required: true })}
                            className="custom-input"
                        />
                        {errors.code && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px]">
                        <label htmlFor="country">País</label>
                        <select
                            id="country"
                            {...register('country', { required: true })}
                            className="custom-select"
                            defaultValue=""
                        >
                            <option
                                value=""
                                disabled
                                className="text-[14px] font-light text-muted-foreground"
                            >
                                Seleccionar País
                            </option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        {errors.country && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px]">
                        <label htmlFor="shipOwner">Propietario del Barco</label>
                        <select
                            id="shipOwner"
                            {...register('shipOwner', { required: true })}
                            className="custom-select"
                            defaultValue=""
                        >
                            <option
                                value=""
                                disabled
                                className="text-[14px] font-light text-muted-foreground"
                            >
                                Seleccionar Propietario
                            </option>
                            {shipOwner.map((owner) => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.name}
                                </option>
                            ))}
                        </select>
                        {errors.shipOwner && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px]">
                        <label htmlFor="shipsType">Tipo de Barco</label>
                        <select
                            id="shipsType"
                            {...register('shipsType', { required: true })}
                            className="custom-select"
                            defaultValue=""
                        >
                            <option
                                value=""
                                disabled
                                className="text-[14px] font-light text-muted-foreground"
                            >
                                Seleccionar Tipo de Barco
                            </option>
                            {shipsType.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        {errors.shipsType && <span>Este campo es obligatorio</span>}
                    </div>
                    {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                    <DialogFooter>
                        <DialogClose asChild>
                            <button type="submit" className="custom-button">
                                Crear Barco
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
