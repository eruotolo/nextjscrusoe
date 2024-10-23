'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

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
import { useSettingContext } from '@/context/SettingContext';
import { getCountryById, updateCountry } from '@/services/countryService';

export default function EditCountryModal({ id }) {
    const { updateCities, updateCountries } = useSettingContext();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        getCountryById(id)
            .then((data) => {
                if (data) {
                    setValue('code', data.code);
                    setValue('name', data.name);
                }
            })
            .catch((error) => console.error('Error fetching country:', error));
    }, [id, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const updatedCountry = await updateCountry(id, data);
            if (updatedCountry) {
                updateCities();
                updateCountries();
            } else {
                console.error('Error updating country');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    return (
        <Dialog>
            <DialogTrigger>
                <FilePenLine className="h-[18px] w-[18px] hover:text-verde" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Editar País</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados con este país. Asegúrate
                        de que los cambios reflejen correctamente la información antes de guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Input
                            id="code"
                            type="text"
                            className="rounded-[10px] border-0 bg-grisclaro px-[15px] uppercase text-[#8D8989] focus:ring-azul"
                            {...register('code', {
                                required: 'Este campo es requerido',
                            })}
                        />
                        {errors.code && <p>{errors.code.message}</p>}
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Input
                            id="name"
                            type="text"
                            className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                            {...register('name', {
                                required: 'Este campo es requerido',
                            })}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                            >
                                Actualizar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
