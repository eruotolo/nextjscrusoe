'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function EditRoleModal({ id, refresh, open, onClose }) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        fetch(`/api/roles/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setValue('name', data.name);
                setValue('state', data.state === 1);
            })
            .catch((error) => {
                console.error('Error fetching role:', error);
            });
    }, [id, setValue]);

    const state = watch('state');

    const onSubmit = handleSubmit(async (data) => {
        try {
            const res = await fetch(`/api/roles/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...data,
                    state: data.state ? 1 : 0,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                await refresh();
                onClose();
            } else {
                console.error('Error updating role:', res.statusText);
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Editar Rol</DialogTitle>
                    <DialogDescription>
                        Modifica el nombre y los permisos asociados a este rol. Asegúrate de que los
                        cambios reflejen las responsabilidades correctas antes de guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="state"
                                {...register('state')}
                                checked={state}
                                onCheckedChange={(checked) => setValue('state', checked)}
                            />
                            <Label
                                htmlFor="airplane-mode"
                                className="text-[14px] font-normal text-[#8D8989]"
                            >
                                {state ? 'Activo' : 'Inactivo'}
                            </Label>
                        </div>
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Input
                            id="name"
                            type="text"
                            className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                            {...register('name', {
                                required: 'Este campo es requerido',
                            })}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                        >
                            Actualizar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
