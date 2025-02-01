'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { getUserById, updateUser } from '@/services/setting/userService';

import Image from 'next/image';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import { FilePenLine } from 'lucide-react';

export default function EditUserModal({ id, refresh, open, onClose }) {
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
                const data = await getUserById(id);
                if (data) {
                    setValue('name', data.name || '');
                    setValue('lastName', data.lastName || '');
                    setValue('email', data.email || '');
                    setValue('phone', data.phone || '');
                    setValue('address', data.address || '');
                    setValue('city', data.city || '');
                    setValue('password', ''); // Campo de contraseña vacío por seguridad
                    setImagePreview(data.image || imagePreview); // Imagen de usuario (o la default)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching user data');
            }
        };

        // Solo se cargan los datos si el modal está abierto y hay un id válido
        if (open && id) fetchData();
    }, [id, open, setValue, imagePreview]);

    const onSubmit = async (data) => {
        setError(''); // Limpia errores previos

        try {
            const formData = new FormData();

            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]); // Agregar datos al FormData
            });

            if (selectedImage) {
                formData.append('file', selectedImage); // Agregar la imagen si fue seleccionada
            }

            const updatedUser = await updateUser(id, formData); // Actualiza los datos del usuario

            if (updatedUser) {
                refresh(); // Refresca los datos en la lista principal
                onClose(); // Cierra el modal
            } else {
                setError('Error updating user');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Error updating user');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Editar Información del Usuario</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del usuario. Asegúrate de actualizar la información
                        correctamente, como el nombre, correo electrónico y demás detalles
                        relevantes antes de guardar los cambios.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3">
                        <div className="col-span-2">
                            <div className="mb-[15px] grid grid-cols-2">
                                <div className="col-span-1 mr-[5px] flex flex-col">
                                    <label htmlFor="name" className="custom-label">
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
                                        className="custom-input"
                                        id="lastName"
                                        name="lastName"
                                        type="text"
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
                            <div className="mb-[15px]">
                                <label htmlFor="city" className="custom-label">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="custom-input"
                                    {...register('password', {
                                        required: false,
                                    })}
                                />
                            </div>
                        </div>
                        <div className="col-span-1 pl-[20px]">
                            <div>
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
                    </div>
                    <DialogFooter>
                        <button type="submit" className="custom-button w-[140px]">
                            Actualizar
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
