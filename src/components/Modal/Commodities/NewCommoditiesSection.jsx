'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createCommoditiesSection } from '@/services/setting/commoditiesSectionService';

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

export default function NewCommoditiesSection({ refresh }) {
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
            const createdCommoditiesSection = await createCommoditiesSection(data);
            if (createdCommoditiesSection) {
                await refresh();
                reset();
            }
        } catch (error) {
            setError('Error de red al crear la sección de mercancías');
            console.error('Error creating commodities section', error);
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
                    <DialogTitle>Crear Nueva Sección de Mercancías</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre de la nueva sección de mercancías que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            type="text"
                            placeholder="Nombre Sección de Mercancías"
                            className="custom-input"
                            {...register('name', { required: 'Este campo es requerido' })}
                        />
                        {errors.name && (
                            <span className="text-rojo text-[12px]">{errors.name.message}</span>
                        )}
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
