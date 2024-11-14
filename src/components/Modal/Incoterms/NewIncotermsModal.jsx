'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createIncoterms } from '@/services/incotermsService';

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

export default function NewIncotermsModal({ refresh }) {
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
            const createdIncoterms = await createIncoterms(data);
            if (createdIncoterms) {
                await refresh();
                reset();
            }
        } catch (error) {
            setError('Error de red al crear el incoterms');
            console.error('Error creating transport type', error);
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
                    <DialogTitle>Crear Nuevo Incoterms</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo país que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3">
                        <div className="col-span-1 mb-[15px] mr-[5px]">
                            <input
                                type="text"
                                placeholder="Código Incoterms"
                                className="custom-input"
                                {...register('code', { required: true })}
                            />
                            {errors.code && <span>Este campo es obligatorio</span>}
                        </div>
                        <div className="col-span-2 mb-[15px] ml-[5px]">
                            <input
                                type="text"
                                placeholder="Nombre del Incoterms"
                                {...register('name', { required: true })}
                                className="custom-input"
                            />
                            {errors.name && <span>Este campo es obligatorio</span>}
                        </div>
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
