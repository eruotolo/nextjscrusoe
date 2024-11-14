'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createTransportType } from '@/services/transportTypeService';

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

export default function NewTransportType({ refresh }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        setError('');
        try {
            const createdTransportType = await createTransportType(data);
            if (createdTransportType) {
                await refresh();
                reset();
            }
        } catch (error) {
            setError('Error de red al crear el tipo de transporte');
            console.error('Error creating transport type', error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Tipo de Transporte</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo tipo de transporte que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            type="text"
                            placeholder="Nombre Tipo de Transporte"
                            {...register('name', { required: true })}
                            className="custom-input"
                        />
                        {errors.name && <span>Este campo es obligatorio</span>}
                    </div>
                    {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                    <DialogFooter>
                        <DialogClose asChild>
                            <button type="submit" className="custom-button">
                                Crear
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
