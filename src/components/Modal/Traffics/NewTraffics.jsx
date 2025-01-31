'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createTraffics } from '@/services/setting/trafficsService';
import useAuthStore from '@/store/authStore';

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

export default function NewTraffics({ refresh }) {
    const session = useAuthStore((state) => state.session);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        setError('');
        // Transforma el id del usuario a un número
        //data.modifiedBy = Number(session?.user?.id) || 0;
        //console.log('Datos:', data);
        try {
            const createdTraffics = await createTraffics(data);
            if (createdTraffics) {
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
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Trafico</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo tipo del trafico que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            type="text"
                            placeholder="Código"
                            {...register('code', { required: true })}
                            className="custom-input"
                        />
                        {errors.name && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            type="text"
                            placeholder="Nombre Español"
                            {...register('name', { required: true })}
                            className="custom-input"
                        />
                        {errors.name && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            type="text"
                            placeholder="Nombre Ingles"
                            {...register('nameEnglish', { required: true })}
                            className="custom-input"
                        />
                        {errors.name && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            type="hidden"
                            value={session?.user?.id || ''}
                            {...register('modifiedBy')}
                        />
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
