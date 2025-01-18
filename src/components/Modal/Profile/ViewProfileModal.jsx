'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import useAuthStore from '@/store/authStore';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function ViewProfileModal({ open, onClose }) {
    const session = useAuthStore((state) => state.session);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        // Lógica para guardar los cambios (fetch a la API, etc.)
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Perfil</DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Edita tu perfil' : 'Detalles de tu perfil'}
                        </DialogDescription>
                    </DialogHeader>
                    {isEditing ? (
                        <form>
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <div className="mb-[15px] grid grid-cols-2">
                                        <div className="col-span-1 mr-[5px] flex flex-col">
                                            <label
                                                htmlFor="name"
                                                className="px-[15px] text-[13px] font-normal text-[#646464]"
                                            >
                                                Nombre
                                            </label>
                                            <input type="text" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <div className="mb-[15px] grid grid-cols-2">
                                        <div className="col-span-1 mr-[5px] flex flex-col">
                                            <label
                                                htmlFor="name"
                                                className="px-[15px] text-[13px] font-normal text-[#646464]"
                                            >
                                                Nombre
                                            </label>
                                            <p className="custom-input">
                                                {session?.user?.name || ''}
                                            </p>
                                        </div>
                                        <div className="col-span-1 ml-[5px] flex flex-col">
                                            <label
                                                htmlFor="lastName"
                                                className="px-[15px] text-[13px] font-normal text-[#646464]"
                                            >
                                                Apellido
                                            </label>
                                            <p className="custom-input">
                                                {session?.user?.lastName || ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-[15px]">
                                        <label
                                            htmlFor="email"
                                            className="px-[15px] text-[13px] font-normal text-[#646464]"
                                        >
                                            Correo Electrónico
                                        </label>
                                        <p className="custom-input">{session?.user?.email || ''}</p>
                                    </div>

                                    <div className="mb-[15px] grid grid-cols-2">
                                        <div className="col-span-1 mr-[5px] flex flex-col">
                                            <label
                                                htmlFor="phone"
                                                className="px-[15px] text-[13px] font-normal text-[#646464]"
                                            >
                                                Teléfono
                                            </label>
                                            <p className="custom-input">
                                                {session?.user?.phone || ''}
                                            </p>
                                        </div>
                                        <div className="col-span-1 ml-[5px] flex flex-col">
                                            <label
                                                htmlFor="phone"
                                                className="px-[15px] text-[13px] font-normal text-[#646464]"
                                            >
                                                Ciudad
                                            </label>
                                            <p className="custom-input">
                                                {session?.user?.city || ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-[15px]">
                                        <label
                                            htmlFor="phone"
                                            className="px-[15px] text-[13px] font-normal text-[#646464]"
                                        >
                                            Dirección
                                        </label>
                                        <p className="custom-input">
                                            {session?.user?.address || ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-1 pl-[20px]">
                                    <Image
                                        src={`/profile/${session?.user?.image || ''}`}
                                        width={220}
                                        height={220}
                                        alt="Vista previa"
                                        className="rounded-[50%]"
                                    />
                                </div>
                            </div>
                            <div className="mt-[10px] flex justify-end">
                                <button className="custom-button" onClick={handleEditClick}>
                                    Editar
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
