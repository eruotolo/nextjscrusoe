'use client';

import { useState, useRef } from 'react';
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
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        password: '',
    });
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

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
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!file || Object.values(formData).some((value) => value === '')) return;

        try {
            const formDataToSend = new FormData();
            formDataToSend.set('file', file);
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.set(key, value);
            });
            formDataToSend.set('state', 1);

            const res = await fetch('/api/users', {
                method: 'POST',
                body: formDataToSend,
            });

            if (res.ok) {
                console.log('File and data uploaded successfully');
                resetForm();
                refresh();
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            password: '',
            file: '',
        });
        setFile(null);
        fileInputRef.current.value = null;
    };

    const isFormValid = () => {
        const { name, lastName, email, phone, address, city, password } = formData;
        return name && lastName && email && phone && address && city && password;
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
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-3">
                        <div className="col-span-2">
                            <div className="mb-[15px] flex">
                                <input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Nombre"
                                    className="custom-input mr-[10px]"
                                />
                                <input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Apellido"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
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
                                <input
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                    className="custom-input"
                                />
                            </div>
                        </div>
                        <div className="col-span-1 pl-[20px]">
                            {file && (
                                <div>
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        width={220}
                                        height={220}
                                        alt="Vista previa"
                                        className="rounded-[50%]"
                                    />
                                </div>
                            )}
                            <label htmlFor="file" className="mb-[10px] mt-[34px] block">
                                Foto de perfil
                            </label>
                            <input
                                id="file"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="custom-input"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <button type="submit" disabled={!isFormValid()} className="custom-button">
                            Crear
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
