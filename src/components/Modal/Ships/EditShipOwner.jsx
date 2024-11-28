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

import { getShipOwnerById, updateShipOwner } from '@/services/shipOwnerService';

export default function EditShipOwner({ id, refresh, open, onClose }) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getShipOwnerById(id);
                if (data) {
                    setValue('code', data.code);
                    setValue('name', data.name);
                }
            } catch (error) {
                console.error('Error fetching shipowner:', error);
            }
        };
        fetchData();
    }, [id, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const updatedShipOwner = await updateShipOwner(id, data);
            if (updatedShipOwner) {
                await refresh();
                onClose();
            } else {
                console.error('Error updating');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar ShipOwner</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados con este shipowner.
                        Asegúrate de que los cambios reflejen correctamente la información antes de
                        guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-3">
                        <div className="col-span-1 mb-[15px] mr-[5px]">
                            <input type="text" className="custom-input" {...register('code')} />
                            {errors.code && <span>{errors.code.message}</span>}
                        </div>
                        <div className="col-span-2 mb-[15px] ml-[5px]">
                            <input
                                type="text"
                                {...register('name', { required: 'Este campo es requerido' })}
                                className="custom-input"
                            />
                            {errors.name && <span>{errors.name.message}</span>}
                        </div>
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
