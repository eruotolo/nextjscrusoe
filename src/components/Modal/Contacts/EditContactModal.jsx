'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import { getContactById, updateContact } from '@/services/setting/contactsService';
import { getContactsType } from '@/services/setting/contactsTypeService';

export default function EditContactModal({ id, refresh, open, onClose }) {
    const [contactType, setContactType] = useState([]);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchContactType = async () => {
            try {
                const conytactTypeData = await getContactsType();
                setContactType(conytactTypeData);
            } catch (err) {
                console.error('Error fetching commodities sections:', err);
                setError('Error al cargar las secciones.');
            }
        };

        fetchContactType();
    }, []);

    useEffect(() => {
        const fetchContact = async () => {
            if (id) {
                try {
                    const contactData = await getContactById(id);
                    if (contactData) {
                        reset({
                            contactTypeId: contactData.contactTypeId || '',
                            name: contactData.name || '',
                            email: contactData.email || '',
                            phone: contactData.phone || '',
                        });
                    }
                } catch (err) {
                    console.error('Error fetching commodity:', err);
                    setError('Error al cargar los datos del commodity.');
                }
            }
        };

        if (open) {
            fetchContact();
        } else {
            reset();
        }
    }, [id, open, reset]);

    const onSubmit = async (data) => {
        setError('');
        try {
            const formattedData = {
                contactTypeId: data.contactTypeId,
                name: data.name,
                email: data.email,
                phone: data.phone,
            };

            await updateContact(id, formattedData);
            await refresh();
            onClose();
        } catch (err) {
            setError('Error de red al actualizar');
            console.error('Error updating commodities:', err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Contacto</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados con esta contacto.
                        Asegúrate de que los cambios reflejen correctamente la información antes de
                        guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <label htmlFor="contactType" className="custom-label">
                            Tipo de Contacto
                        </label>
                        <select
                            id="contactType"
                            {...register('contactTypeId', { required: true })}
                            className="custom-select"
                        >
                            <option value="" disabled>
                                Seleccionar
                            </option>
                            {contactType.map((type) => (
                                <option value={type.id} key={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-[15px] grid grid-cols-1">
                        <label htmlFor="name" className="custom-label">
                            Nombre
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register('name', { required: true })}
                            className="custom-input"
                        />
                        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                    </div>

                    <div className="mb-[15px] grid grid-cols-1">
                        <label htmlFor="email" className="custom-label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', {
                                required: 'El email es requerido',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Dirección de email inválida',
                                },
                            })}
                            className="custom-input"
                        />
                    </div>

                    <div className="mb-[15px] grid grid-cols-1">
                        <label htmlFor="phone" className="custom-label">
                            Teléfono
                        </label>
                        <input
                            type="text"
                            {...register('phone', { required: true })}
                            className="custom-input"
                        />
                    </div>

                    {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                    <DialogFooter>
                        <button type="submit" className="custom-button">
                            Actualizar
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
