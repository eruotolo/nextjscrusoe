'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

export default function ChangeUserPassModal({ id, refresh, open, onClose }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);

    const {
        register,
        handleSubmit,
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
            await refresh();
            resetForm();
            onClose();
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
        <Dialog open={open} onOpenChange={onClose}>
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
                            <label
                                for="password"
                                className="px-[15px] text-[13px] font-normal text-[#646464]"
                            >
                                Ingrese Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="custom-input"
                                placeholder="**********"
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
                            <label
                                for="confirmPassword"
                                className="px-[15px] text-[13px] font-normal text-[#646464]"
                            >
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="custom-input"
                                placeholder="**********"
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
                        <button type="submit" disabled={isDisabled} className="custom-button">
                            Actualizar
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
