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

    const onSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some((value) => value === '')) return;

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                console.log('User created successfully:', data);
                resetForm();
                refresh();
                onClose();
            } else {
                console.error('Error creating user:', data.message);
                // Aquí puedes mostrar un mensaje de error al usuario
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Aquí puedes mostrar un mensaje de error al usuario
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
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nombre"
                                    className="custom-input mr-[10px]"
                                />
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Apellido"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Teléfono"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Dirección"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    id="city"
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Ciudad"
                                    className="custom-input"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Contraseña"
                                    className="custom-input"
                                />
                            </div>
                        </div>
                        <div className="col-span-1 pl-[20px]">
                            <div>
                                <Image
                                    src="/profile/perfil-default.jpg"
                                    width={220}
                                    height={220}
                                    alt="Perfil por defecto"
                                    className="rounded-[50%]"
                                />
                            </div>
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
