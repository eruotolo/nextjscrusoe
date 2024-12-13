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
    } = useForm();

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchShipOwner = async () => {
            const shipOwnerData = await getShipOwner();
            setShipOwner(shipOwnerData);
        };
        fetchShipOwner();
    }, []);

    useEffect(() => {
        const fetchShipsType = async () => {
            const shipsTypeData = await getShipsType();
            setShipsType(shipsTypeData);
        };
        fetchShipsType();
    }, []);

    useEffect(() => {
        const fetchShipData = async () => {
            if (id) {
                const shipsData = await getShipsById(id);
                if (shipsData) {
                    setValue('name', shipsData.name || '');
                    setValue('code', shipsData.code || '');
                    setSelectedCountry(shipsData.codeCountry);
                    setSelectedShipOwner(shipsData.shipownerId);
                    setSelectedShipsType(shipsData.shipsTypeId);
                }
            }
        };
        if (open) {
            fetchShipData();
        }
    }, [id, open, setValue]);

    const onSubmit = async (data) => {
        try {
            const response = await updateShips(id, {
                ...data,
                shipownerId: selectedShipOwner,
                codeCountry: selectedCountry,
                shipsTypeId: selectedShipsType,
            });
            if (response) {
                await refresh();
                onClose();
            } else {
                console.error('No se pudo actualizar la data');
                setError('No se pudo actualizar la data');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Error al enviar el formulario: ' + error.message);
        }
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px]">
                        <label htmlFor="name">Nombre del Barco</label>
                        <input
                            id="name"
                            type="text"
                            {...register('name', { required: 'Este campo es obligatorio' })}
                            className="custom-input"
                        />
                        {errors.name && <span>{errors.name.message}</span>}
                    </div>

                    <div className="mb-[15px]">
                        <label htmlFor="code">Código del Barco</label>
                        <input
                            id="code"
                            type="text"
                            {...register('code', { required: 'Este campo es obligatorio' })}
                            className="custom-input"
                        />
                        {errors.code && <span>{errors.code.message}</span>}
                    </div>

                    <div className="mb-[15px]">
                        <label htmlFor="codeCountry">País</label>
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
                        {errors.codeCountry && <span>{errors.codeCountry.message}</span>}
                    </div>

                    <div className="mb-[15px]">
                        <label htmlFor="shipownerId">Propietario del Barco</label>
                        <select
                            id="shipownerId"
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
                        {errors.shipownerId && <span>{errors.shipownerId.message}</span>}
                    </div>

                    <div className="mb-[15px]">
                        <label htmlFor="shipsTypeId">Tipo de Barco</label>
                        <select
                            id="shipsTypeId"
                            className="custom-select"
                            value={selectedShipsType}
                            onChange={(e) => setSelectedShipsType(e.target.value)}
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
                        {errors.shipsTypeId && <span>{errors.shipsTypeId.message}</span>}
                    </div>
                    {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                    <DialogFooter>
                        <button type="submit" className="custom-button">
                            Actualizar Barco
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
