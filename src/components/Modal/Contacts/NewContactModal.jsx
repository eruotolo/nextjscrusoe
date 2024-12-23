'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { createContact } from '@/services/setting/contactsService';
import { getContactsType } from '@/services/setting/contactsTypeService';
import { Plus } from 'lucide-react';

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

export default function NewContactModal({ refresh, partnerId }) {
    const [contactType, setContactType] = useState([]);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        const fetchContactType = async () => {
            const contactTypeData = await getContactsType();
            setContactType(contactTypeData);
        };
        fetchContactType();
    }, []);

    const onSubmit = async (data) => {
        setError('');
        try {
            const formattedData = {
                contactTypeId: data.contactTypeId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                partnerId: data.partnerId,
            };

            const createdContact = await createContact(formattedData);
            if (createdContact) {
                await refresh();
                reset();
            }
        } catch (error) {
            setError('Error de red al crear');
            console.error('Error creating', error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Contacto</DialogTitle>
                    <DialogDescription>
                        Introduce los datos del contacto que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <select
                            id="contactTypeId"
                            {...register('contactTypeId', { required: true })}
                            className="custom-select"
                            defaultValue=""
                        >
                            <option
                                value=""
                                disabled
                                className="text-[14px] font-light text-muted-foreground"
                            >
                                Seleccionar el tipo
                            </option>
                            {contactType.map((type) => (
                                <option value={type.id} key={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            type="text"
                            placeholder="Nombre"
                            {...register('name', { required: true })}
                            className="custom-input"
                        />
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            type="email"
                            placeholder="Email"
                            {...register('email', { required: true })}
                            className="custom-input"
                        />
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <input
                            type="text"
                            placeholder="Teléfono"
                            {...register('phone', { required: true })}
                            className="custom-input"
                        />
                    </div>
                    <div className="hidden">
                        <input
                            type="text"
                            {...register('partnerId')}
                            value={partnerId}
                            className="custom-input"
                        />
                    </div>

                    {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                    <DialogFooter>
                        <DialogClose asChild>
                            <button type="submit" className="custom-button">
                                Crear
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
