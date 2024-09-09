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
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { FilePenLine } from 'lucide-react';
import { useSettingContext } from '@/context/SettingContext';

export default function EditRoleModal({ id }) {
    const { updateRoles, updateUsers } = useSettingContext();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        fetch(`/api/roles/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setValue('name', data.name);
            })
            .catch((error) => console.error('Error fetching role:', error));
    }, [id, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        const res = await fetch(`/api/roles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
        });
        if (res.ok) {
            updateUsers();
            updateRoles();
        }
    });

    return (
        <Dialog>
            <DialogTrigger>
                <FilePenLine className="h-[18px] w-[18px] hover:text-verde" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Rol</DialogTitle>
                    <DialogDescription>
                        Modifica el nombre y los permisos asociados a este rol. Asegúrate de que los
                        cambios reflejen las responsabilidades correctas antes de guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
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
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                            >
                                Actualizar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
