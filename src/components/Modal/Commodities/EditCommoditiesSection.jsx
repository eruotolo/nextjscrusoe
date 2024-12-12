'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import {
    getCommoditiesSectionId,
    updateCommoditiesSection,
} from '@/services/setting/commoditiesSectionService';

export default function EditCommoditiesSection({ id, refresh, open, onClose }) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        getCommoditiesSectionId(id)
            .then((data) => {
                if (data) {
                    setValue('name', data.name);
                }
            })
            .catch((error) => console.error('Error fetching commodities section:', error));
    }, [id, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const updatedCommoditiesSection = await updateCommoditiesSection(id, data);
            if (updatedCommoditiesSection) {
                await refresh();
                onClose();
            } else {
                console.error('Error updating commodities section');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Sección de Mercancías</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados con esta sección de
                        mercancías. Asegúrate de que los cambios reflejen correctamente la
                        información antes de guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <label htmlFor="name" className="custom-label">
                            Nombre
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Nombre Tipo de Transporte"
                            {...register('name', { required: 'Este campo es requerido' })}
                            className="custom-input"
                        />
                        {errors.name && <span>{errors.name.message}</span>}
                    </div>
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
