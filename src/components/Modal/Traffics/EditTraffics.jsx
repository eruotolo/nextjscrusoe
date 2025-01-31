'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import { getTrafficsById, updateTraffics } from '@/services/setting/trafficsService';

export default function EditTraffics({ id, refresh, open, onClose }) {
    const session = useAuthStore((state) => state.session);
    //console.log('Session', session);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTrafficsById(id);
                if (data) {
                    setValue('code', data.code);
                    setValue('name', data.name);
                    setValue('nameEnglish', data.nameEnglish);
                    setValue('modifiedBy', session?.user?.id);
                }
            } catch (error) {
                console.error('Error fetching transport type:', error);
            }
        };
        fetchData();
    }, [id, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const updatedTraffics = await updateTraffics(id, data);
            // console.log('Datos;', updatedTraffics);
            if (updatedTraffics) {
                await refresh();
                onClose();
            } else {
                console.error('Error updating Traffics');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Editar Tipo de Traffics</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados con este tipo de trafico.
                        Asegúrate de que los cambios reflejen correctamente la información antes de
                        guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <label htmlFor="code" className="custom-label">
                            Código
                        </label>
                        <input
                            id="code"
                            type="text"
                            {...register('code', { required: true })}
                            className="custom-input"
                        />
                        {errors.name && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <label htmlFor="name" className="custom-label">
                            Nombre Español
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Nombre Español"
                            {...register('name', { required: true })}
                            className="custom-input"
                        />
                        {errors.name && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <label htmlFor="nameEnglish" className="custom-label">
                            Nombre Ingles
                        </label>
                        <input
                            id="nameEnglish"
                            type="text"
                            placeholder="Nombre Ingles"
                            {...register('nameEnglish', { required: true })}
                            className="custom-input"
                        />
                        {errors.name && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input id="modifiedBy" type="text" {...register('modifiedBy')} hidden />
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
