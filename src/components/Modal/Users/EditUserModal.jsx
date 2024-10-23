'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { FilePenLine } from 'lucide-react';
import { Label } from '@/components/ui/label';

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
                    <DialogFooter>
                        <Button
                            type="submit"
                            className="h-[36px] w-[100px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]"
                        >
                            Actualizar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
