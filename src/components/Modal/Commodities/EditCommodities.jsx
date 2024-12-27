'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import { getCommoditiesId, updateCommodities } from '@/services/setting/commoditiesService';
import { getCommoditiesSection } from '@/services/setting/commoditiesSectionService';

export default function EditCommodities({ id, refresh, open, onClose }) {
    const [commoditiesSection, setCommoditiesSection] = useState([]);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchCommoditiesSection = async () => {
            try {
                const commoditiesSectionData = await getCommoditiesSection();
                setCommoditiesSection(commoditiesSectionData);
            } catch (err) {
                console.error('Error fetching commodities sections:', err);
                setError('Error al cargar las secciones.');
            }
        };

        fetchCommoditiesSection();
    }, []);

    useEffect(() => {
        const fetchCommodities = async () => {
            if (id) {
                try {
                    const commoditiesData = await getCommoditiesId(id);
                    if (commoditiesData) {
                        reset({
                            name: commoditiesData.name || '',
                            nameEnglish: commoditiesData.nameEnglish || '',
                            tariffPositional: commoditiesData.tariffPositional || '',
                            dangerous: commoditiesData.dangerous ? 'true' : 'false',
                            perishable: commoditiesData.perishable ? 'true' : 'false',
                            commoditiesSectionId: commoditiesData.commoditiesSectionId || '',
                        });
                    }
                } catch (err) {
                    console.error('Error fetching commodity:', err);
                    setError('Error al cargar los datos del commodity.');
                }
            }
        };

        if (open) {
            fetchCommodities();
        } else {
            reset();
        }
    }, [id, open, reset]);

    const onSubmit = async (data) => {
        setError('');
        try {
            const formattedData = {
                name: data.name,
                nameEnglish: data.nameEnglish,
                dangerous: data.dangerous === 'true',
                perishable: data.perishable === 'true',
                tariffPositional: data.tariffPositional,
                commoditiesSectionId: data.commoditiesSectionId,
            };

            await updateCommodities(id, formattedData);
            await refresh();
            onClose();
        } catch (err) {
            setError('Error de red al actualizar');
            console.error('Error updating commodities:', err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Commodities</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados con esta commodity.
                        Asegúrate de que los cambios reflejen correctamente la información antes de
                        guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px]">
                        <label htmlFor="name" className="custom-label">
                            Nombre Español
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register('name', { required: 'Este campo es obligatorio' })}
                            className="custom-input"
                        />
                        {errors.name && <span>{errors.name.message}</span>}
                    </div>

                    <div className="mb-[15px]">
                        <label htmlFor="nameEnglish" className="custom-label">
                            Nombre Inglés
                        </label>
                        <input
                            id="nameEnglish"
                            type="text"
                            {...register('nameEnglish', { required: 'Este campo es obligatorio' })}
                            className="custom-input"
                        />
                        {errors.nameEnglish && <span>{errors.nameEnglish.message}</span>}
                    </div>

                    <div className="mb-[15px]">
                        <label htmlFor="dangerous" className="custom-label">
                            El producto es peligroso
                        </label>
                        <select
                            id="dangerous"
                            {...register('dangerous', { required: 'Selecciona una opción' })}
                            className="custom-select"
                        >
                            <option value="" disabled>
                                Seleccionar
                            </option>
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                        {errors.dangerous && <span>{errors.dangerous.message}</span>}
                    </div>

                    <div className="mb-[15px]">
                        <label htmlFor="perishable" className="custom-label">
                            El producto es perecedero
                        </label>
                        <select
                            id="perishable"
                            {...register('perishable', { required: 'Selecciona una opción' })}
                            className="custom-select"
                        >
                            <option value="" disabled>
                                Seleccionar
                            </option>
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                        {errors.perishable && <span>{errors.perishable.message}</span>}
                    </div>

                    <div className="mb-[15px]">
                        <label htmlFor="tariffPositional" className="custom-label">
                            Posición Arancelaria
                        </label>
                        <input
                            id="tariffPositional"
                            type="text"
                            {...register('tariffPositional', {
                                required: 'Este campo es obligatorio',
                            })}
                            className="custom-input"
                        />
                        {errors.tariffPositional && <span>{errors.tariffPositional.message}</span>}
                    </div>

                    <div className="mb-[15px]">
                        <label htmlFor="commoditiesSection" className="custom-label">
                            Seleccionar Sector
                        </label>
                        <select
                            id="commoditiesSection"
                            {...register('commoditiesSectionId', {
                                required: 'Selecciona un sector',
                            })}
                            className="custom-select"
                        >
                            <option value="" disabled>
                                Seleccionar
                            </option>
                            {commoditiesSection.map((section) => (
                                <option value={section.id} key={section.id}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                        {errors.commoditiesSectionId && (
                            <span>{errors.commoditiesSectionId.message}</span>
                        )}
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
