'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import useAuthStore from '@/store/authStore';
import { updateUser } from '@/services/setting/userService';

import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogClose,
    DialogTitle,
} from '@/components/ui/dialog';
import { FilePenLine } from 'lucide-react';

export default function ViewProfileModal({ open, onClose }) {
    const session = useAuthStore((state) => state.session);
    const fetchSession = useAuthStore((state) => state.fetchSession); // Importa fetchSession

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(
        'https://res.cloudinary.com/crusoeproduccion/image/upload/v1737207089/profile/perfil-default.jpg'
    );
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Vista previa
            };
            reader.readAsDataURL(file);
            setSelectedImage(file); // Guardar imagen seleccionada
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await session?.user;
                if (data) {
                    setValue('name', data.name || '');
                    setValue('lastName', data.lastName || '');
                    setValue('email', data.email || '');
                    setValue('phone', data.phone || '');
                    setValue('address', data.address || '');
                    setValue('city', data.city || '');
                    setImagePreview(data.image || imagePreview);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching user data');
            }
        };
        fetchData();
    }, [session, setValue]);

    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const onSubmit = async (data) => {
        setError('');
        try {
            const formData = new FormData();

            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            if (selectedImage) {
                formData.append('file', selectedImage);
            }

            // Actualizar usuario
            const updatedUser = await updateUser(session.user.id, formData);

            if (updatedUser) {
                // Refrescar la sesión usando fetchSession
                await fetchSession();
                handleCancelClick();
            } else {
                setError('Error al actualizar el usuario.');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setError('Error al actualizar el usuario.');
        }
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <div className="mb-[15px] grid grid-cols-2">
                                        <div className="col-span-1 mr-[5px] flex flex-col">
                                            <label htmlFor="lastName" className="custom-label">
                                                Nombre
                                            </label>
                                            <input
                                                className="custom-input"
                                                id="name"
                                                name="name"
                                                type="text"
                                                {...register('name')}
                                            />
                                        </div>
                                        <div className="col-span-1 ml-[5px] flex flex-col">
                                            <label htmlFor="lastName" className="custom-label">
                                                Apellido
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                className="custom-input"
                                                {...register('lastName')}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-[15px]">
                                        <label htmlFor="email" className="custom-label">
                                            Correo Electrónico
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            className="custom-input"
                                            {...register('email')}
                                        />
                                    </div>
                                    <div className="mb-[15px]">
                                        <label htmlFor="phone" className="custom-label">
                                            Teléfono
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="text"
                                            className="custom-input"
                                            {...register('phone')}
                                        />
                                    </div>
                                    <div className="mb-[15px]">
                                        <label htmlFor="address" className="custom-label">
                                            Dirección
                                        </label>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            className="custom-input"
                                            {...register('address')}
                                        />
                                    </div>
                                    <div className="mb-[15px]">
                                        <label htmlFor="city" className="custom-label">
                                            Ciudad
                                        </label>
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            className="custom-input"
                                            {...register('city')}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 pl-[20px]">
                                    <Image
                                        src={imagePreview || '/placeholder.svg'}
                                        width={220}
                                        height={220}
                                        alt="Vista previa de la imagen"
                                        className="h-[220px] w-[220px] rounded-[50%] object-cover"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="mt-[34px] flex w-full cursor-pointer items-center justify-center rounded-md bg-gris px-4 py-2 text-[12px] font-medium text-white hover:bg-grisclaro hover:text-gris focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        <FilePenLine className="mr-2 h-5 w-5" />
                                        Cambiar foto de perfil
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <button type="submit" className="custom-button w-[140px]">
                                    Actualizar
                                </button>
                            </DialogFooter>
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
                                        src={session?.user?.image || ''}
                                        width={220}
                                        height={220}
                                        alt="Vista previa"
                                        className="rounded-[50%]"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <div className="mt-[10px] flex justify-end">
                                    <DialogClose className="custom-button-close mr-[20px]">
                                        Cerrar
                                    </DialogClose>
                                    <button className="custom-button" onClick={handleEditClick}>
                                        Editar
                                    </button>
                                </div>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
