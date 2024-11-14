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

import { getTransportTypeById, updateTransportType } from '@/services/transportTypeService';

export default function EditTransportType({ id, refresh, open, onClose }) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        getTransportTypeById(id)
            .then((data) => {
                if (data) {
                    setValue('name', data.name);
                }
            })
            .catch((error) => console.error('Error fetching transport type:', error));
    }, [id, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const updatedTransportType = await updateTransportType(id, data);
            if (updatedTransportType) {
                await refresh();
                onClose();
            } else {
                console.error('Error updating transport type');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Editar Tipo de Transporte</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados con este tipo de
                        transporte. Asegúrate de que los cambios reflejen correctamente la
                        información antes de guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
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
