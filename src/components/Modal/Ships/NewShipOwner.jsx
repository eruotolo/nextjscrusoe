'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createShipOwner } from '@/services/shipOwnerService';

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

export default function NewShipOwner({ refresh }) {
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
            const createdShipOwner = await createShipOwner(data);
            if (createdShipOwner) {
                await refresh();
                reset();
            }
        } catch (error) {
            setError('Error de red al crear el ShipOwner');
            console.error('Error creating ShipOwner', error);
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
                    <DialogTitle>Crear Nuevo Armador/Shipowner</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo armador que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3">
                        <div className="col-span-1 mb-[15px] mr-[5px]">
                            <input
                                type="text"
                                placeholder="Código Armador"
                                className="custom-input"
                                {...register('code', { required: true })}
                            />
                            {errors.code && <span>Este campo es obligatorio</span>}
                        </div>
                        <div className="col-span-2 mb-[15px] ml-[5px]">
                            <input
                                type="text"
                                placeholder="Nombre del Armador"
                                className="custom-input"
                                {...register('name', { required: true })}
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
