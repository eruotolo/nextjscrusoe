'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createUser } from '@/services/setting/userService';
import { FilePenLine } from 'lucide-react';

import Image from 'next/image';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function NewUserModal({ open, onClose, refresh }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [error, setError] = useState('');

    const [imagePreview, setImagePreview] = useState(
        'https://res.cloudinary.com/crusoeproduccion/image/upload/v1737207089/profile/perfil-default.jpg'
    );
    // Estado para la imagen seleccionada
    const [selectedImage, setSelectedImage] = useState(null);
    // Archivo de imagen seleccionado

    // Manejo del cambio en el input de archivo
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Actualiza el preview de la imagen
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Muestra la imagen preview
            };
            reader.readAsDataURL(file);

            setSelectedImage(file); // Guarda el archivo seleccionado
        }
    };

    const onSubmit = async (data) => {
        setError('');

        try {
            const formData = new FormData();

            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            if (selectedImage) {
                formData.append('file', selectedImage); // Añade la imagen correctamente
            }

            // Log para inspeccionar el contenido del FormData
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const createdUser = await createUser(formData);

            if (createdUser) {
                refresh();
                onClose();
                reset();
                setImagePreview(
                    'https://res.cloudinary.com/crusoeproduccion/image/upload/v1737207089/profile/perfil-default.jpg'
                ); // Resetea la imagen al valor por defecto
                setSelectedImage(null); // Limpia el archivo seleccionado
            } else {
                console.error('Error creating user:', data.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                        Introduce los datos del nuevo usuario, como el nombre y correo electrónico
                        .Asegúrate de que toda la información esté correcta antes de proceder a
                        crear la cuenta.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3">
                        <div className="col-span-2">
                            <div className="mb-[15px] flex">
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    {...register('name', { required: true })}
                                    placeholder="Nombre"
                                    className="custom-input mr-[10px]"
                                />
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    {...register('lastName', { required: true })}
                                    placeholder="Apellido"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    {...register('email', { required: true })}
                                    placeholder="Email"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    {...register('phone', { required: true })}
                                    placeholder="Teléfono"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    {...register('address', { required: true })}
                                    placeholder="Dirección"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    id="city"
                                    type="text"
                                    name="city"
                                    {...register('city', { required: true })}
                                    placeholder="Ciudad"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    {...register('password', { required: true })}
                                    placeholder="Contraseña"
                                    className="custom-input"
                                />
                            </div>
                        </div>
                        <div className="col-span-1 pl-[20px]">
                            <div>
                                <Image
                                    src={imagePreview}
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
                                    className="hidden" // Ocultar el input original
                                    onChange={handleImageChange} // Maneja el cambio de archivo
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <button type="submit" className="custom-button">
                            Crear
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
