'use client';

import { useState, useRef } from 'react';
import { useSettingContext } from '@/context/SettingContext';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

export default function NewUserModal() {
    const { updateUsers } = useSettingContext();

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
                updateUsers();
                // Aquí puedes agregar lógica adicional después de un envío exitoso
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
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
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Nombre"
                                    className="mr-[10px] rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                />
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Apellido"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <Input
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    type="email"
                                    placeholder="Correo Electrónico"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Teléfono"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Dirección"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Ciudad"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                                />
                            </div>
                            <div className="mb-[15px]">
                                <Input
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                    className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
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
                            <Label htmlFor="file" className="mb-[10px] mt-[34px] block">
                                Foto de perfil
                            </Label>
                            <Input
                                id="file"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="h-[36px] w-[100px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]"
                            >
                                Crear
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
