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

import { getCountryById, updateCountry } from '@/services/countryService';

export default function EditCountryModal({ id, refresh, open, onClose }) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        getCountryById(id)
            .then((data) => {
                if (data) {
                    setValue('code', data.code);
                    setValue('name', data.name);
                }
            })
            .catch((error) => console.error('Error fetching country:', error));
    }, [id, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const updatedCountry = await updateCountry(id, data);
            if (updatedCountry) {
                await refresh();
                onClose();
            } else {
                console.error('Error updating country');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Editar País</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados con este país. Asegúrate
                        de que los cambios reflejen correctamente la información antes de guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            id="code"
                            type="text"
                            className="custom-input"
                            {...register('code', {
                                required: 'Este campo es requerido',
                            })}
                        />
                        {errors.code && <p>{errors.code.message}</p>}
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            id="name"
                            type="text"
                            className="custom-input"
                            {...register('name', {
                                required: 'Este campo es requerido',
                            })}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
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
