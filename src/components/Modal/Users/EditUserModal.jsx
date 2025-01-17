'use client';

import { useEffect, useRef, useState } from 'react';
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
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        password: '',
        image: '', // para almacenar la ruta de la imagen
    });
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch(`/api/users/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData({
                    name: data.name,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    password: '', // No recuperar el password por seguridad
                    image: data.image, // almacenar la ruta de la imagen
                });
            })
            .catch((error) => console.error('Error fetching user:', error));
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setFormData((prevData) => ({
                ...prevData,
                image: '', // limpiar la imagen previa
            }));
        }
    };

    const handleCustomFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = new FormData();
            if (file) {
                updateData.append('file', file);
            }
            Object.keys(formData).forEach((key) => {
                if (formData[key]) {
                    updateData.append(key, formData[key]);
                }
            });

            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                body: updateData,
            });

            if (res.ok) {
                console.log('File and data uploaded successfully');
                await refresh();
                onClose();
            } else {
                const errorData = await res.json();
                console.error('Error updating user:', errorData);
            }
        } catch (error) {
            console.error('Error updating user:', error);
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
                <form onSubmit={onSubmit}>
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
                                    <input
                                        className="custom-input"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Nombre"
                                    />
                                </div>
                                <div className="col-span-1 ml-[5px] flex flex-col">
                                    <label
                                        htmlFor="lastName"
                                        className="px-[15px] text-[13px] font-normal text-[#646464]"
                                    >
                                        Apellido
                                    </label>
                                    <input
                                        className="custom-input"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Apellido"
                                    />
                                </div>
                            </div>
                            <div className="mb-[15px]">
                                <label
                                    htmlFor="email"
                                    className="px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    type="email"
                                    placeholder="Correo Electrónico"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <label
                                    htmlFor="phone"
                                    className="px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Teléfono
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Teléfono"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <label
                                    htmlFor="address"
                                    className="px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Dirección
                                </label>
                                <input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Dirección"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <label
                                    htmlFor="city"
                                    className="px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Ciudad
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Ciudad"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <label
                                    htmlFor="city"
                                    className="px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    type="password"
                                    placeholder="*******"
                                    className="custom-input"
                                />
                            </div>
                        </div>
                        <div className="col-span-1 pl-[20px]">
                            {file ? (
                                <div>
                                    <Image
                                        src={
                                            typeof file === 'string'
                                                ? file
                                                : URL.createObjectURL(file)
                                        }
                                        width={220}
                                        height={220}
                                        alt="Vista previa"
                                        className="rounded-[50%]"
                                    />
                                </div>
                            ) : formData.image ? (
                                <div>
                                    <Image
                                        src={`/profile/${formData.image}`}
                                        width={220}
                                        height={220}
                                        alt="Vista previa"
                                        className="rounded-[50%]"
                                    />
                                </div>
                            ) : null}

                            <input
                                id="file"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={handleCustomFileButtonClick}
                                className="mt-[34px] flex w-full items-center justify-center rounded-md bg-gris px-4 py-2 text-[12px] font-medium text-white hover:bg-grisclaro hover:text-gris focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <FilePenLine className="mr-2 h-5 w-5" />
                                Cambiar foto de perfil
                            </button>
                            {file && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Archivo seleccionado: {file.name}
                                </p>
                            )}
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
