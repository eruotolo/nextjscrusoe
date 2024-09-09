'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { KeyRound } from 'lucide-react';
import { useSettingContext } from '@/context/SettingContext';

export default function ChangeUserPassModal({ id }) {
    const { updateUsers } = useSettingContext();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = handleSubmit(async (data) => {
        const formData = new FormData();
        formData.append('password', data.password);

        const res = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            body: formData,
        });

        if (res.ok) {
            updateUsers();
            resetForm();
        }
    });

    const resetForm = () => {
        reset();
        setPassword('');
        setConfirmPassword('');
        setIsDisabled(true);
    };

    useEffect(() => {
        if (password && confirmPassword && password === confirmPassword) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [password, confirmPassword]);

    return (
        <Dialog>
            <DialogTrigger className="flex items-center">
                <KeyRound className="h-[18px] w-[18px] hover:text-verde" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Cambiar Contraseña</DialogTitle>
                    <DialogDescription>
                        Introduce una nueva contraseña para el usuario. Asegúrate de que cumpla con
                        los requisitos de seguridad antes de guardar los cambios.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <div className="mb-[15px]">
                            <Input
                                id="password"
                                type="password"
                                className="block w-full rounded-md border-0 px-[10px] py-[4px] text-[#4B5563] ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[15px] sm:leading-6"
                                {...register('password', {
                                    required: {
                                        value: true,
                                        message: 'Contenido Requerido',
                                    },
                                })}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <p>{errors.password.message}</p>}
                        </div>
                        <div className="mb-[15px]">
                            <Input
                                id="confirmPassword"
                                type="password"
                                className="block w-full rounded-md border-0 px-[10px] py-[4px] text-[#4B5563] ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[15px] sm:leading-6"
                                {...register('confirmPassword', {
                                    required: {
                                        value: true,
                                        message: 'Contenido Requerido',
                                    },
                                })}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                                disabled={isDisabled}
                            >
                                Guardar Cambios
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
