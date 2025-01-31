'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

import useAuthStore from '@/store/authStore';
import { changeUserPassword } from '@/services/setting/userService';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

export default function ChangePasswordModal({ open, onClose }) {
    const [error, setError] = useState('');
    const session = useAuthStore((state) => state.session);
    const fetchSession = useAuthStore((state) => state.fetchSession); // Importa fetchSession

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setError('');
        try {
            const formData = new FormData();
            formData.append('password', data.password);

            const updatedUser = await changeUserPassword(session.user.id, formData);
            //console.log('NewPassword:', updatedUser);

            if (updatedUser) {
                await fetchSession();
                reset();
                onClose();
            } else {
                setError('Error al actualizar el usuario.');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setError('Error al actualizar el usuario.');
        }
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
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Cambiar Contraseña</DialogTitle>
                    <DialogDescription>
                        Introduce una nueva contraseña para el usuario. Asegúrate de que cumpla con
                        los requisitos de seguridad antes de guardar los cambios.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <div className="mb-[15px]">
                            <label
                                htmlFor="password"
                                className="px-[15px] text-[13px] font-semibold text-[#333]"
                            >
                                Ingrese La Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="custom-input"
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
                                htmlFor="confirmPassword"
                                className="px-[15px] text-[13px] font-semibold text-[#333]"
                            >
                                Confirmar La Nueva Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="custom-input"
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
