'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { getCountries } from '@/services/setting/countryService';
import { getShipOwner } from '@/services/setting/shipOwnerService';
import { getShipsType } from '@/services/setting/shipsTypeService';
import { getShipsById, updateShips } from '@/services/setting/shipsService';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';

export default function EditShips({ id, refresh, open, onClose }) {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [shipOwner, setShipOwner] = useState([]);
    const [selectedShipOwner, setSelectedShipOwner] = useState('');
    const [shipsType, setShipsType] = useState([]);
    const [selectedShipsType, setSelectedShipsType] = useState('');

    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fecthShipsType = async () => {
            const shipsTypeData = await getShipsType();
            setShipsType(shipsTypeData);
        };
        fecthShipsType();
    }, []);

    useEffect(() => {
        const fetchShipOwner = async () => {
            const shipOwnerData = await getShipOwner();
            setShipOwner(shipOwnerData);
        };
        fetchShipOwner();
    }, []);

    useEffect(() => {
        const fetchShips = async () => {
            if (id) {
                const shipsData = await getShipsById(id);
                if (shipsData) {
                    setValue('name', shipsData.name || '');
                    setValue('code', shipsData.code || '');

                    setSelectedCountry(shipsData.codeCountry || '');
                    setSelectedShipOwner(shipsData.shipownerId || '');
                    setSelectedShipsType(shipsData.shipsTypeId || '');
                }
                console.log('Datos:', shipsData);
            }
        };
        if (open) {
            fetchShips();
        }
    }, [id, open, setValue]);

    const onSubmit = async (data) => {
        setError('');
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Barco</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles del barco que deseas actualizar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
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
                        {errors.country && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px]">
                        <label htmlFor="shipOwner">Propietario del Barco</label>
                        <select
                            id="shipOwner"
                            value={selectedShipOwner}
                            onChange={(e) => setSelectedShipOwner(e.target.value)}
                            className="custom-select"
                        >
                            <option value="" disabled>
                                Seleccione un propietario
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
                            value={selectedShipsType}
                            onChange={(e) => setSelectedShipsType(e.target.value)}
                            className="custom-select"
                        >
                            <option value="" disabled>
                                Seleccione un tipo de barco
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
                                Actualizar Barco
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
