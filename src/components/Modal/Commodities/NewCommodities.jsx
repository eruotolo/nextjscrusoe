'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { getCommoditiesSection } from '@/services/setting/commoditiesSectionService';
import { createCommodities } from '@/services/setting/commoditiesService';

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

import { Plus } from 'lucide-react';

export default function NewCommodities({ refresh }) {
    const [commoditiesSection, setCommoditiesSection] = useState([]);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        const fetchCommoditiesSection = async () => {
            const commoditiesSectionData = await getCommoditiesSection();
            setCommoditiesSection(commoditiesSectionData);
        };
        fetchCommoditiesSection();
    }, []);

    const onSubmit = async (data) => {
        setError('');
        try {
            const formattedData = {
                name: data.name,
                nameEnglish: data.nameEnglish,
                dangerous: data.dangerous === 'true',
                perishable: data.perishable === 'true',
                tariffPositional: data.tariffPositional,
                commoditiesSectionId: data.commoditiesSectionId,
            };

            const createdCommodities = await createCommodities(formattedData);
            if (createdCommodities) {
                await refresh();
                reset();
            }
        } catch (error) {
            setError('Error de red al crear');
            console.error('Error creating commodities', error);
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
                    <DialogTitle>Crear Nuevo Commodities</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre de la nuevo commodities que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[15px]">
                        <input
                            id="name"
                            type="text"
                            placeholder="Nombre Español"
                            {...register('name', { required: true })}
                            className="custom-input"
                        />
                        {errors.name && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px]">
                        <input
                            type="text"
                            id="nameEnglish"
                            placeholder="Nombre Ingles"
                            {...register('nameEnglish', { required: true })}
                            className="custom-input"
                        />
                    </div>
                    <div className="mb-[15px]">
                        <select
                            id="dangerous"
                            {...register('dangerous', { required: true })}
                            className="custom-select"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                El producto es peligroso
                            </option>
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                        {errors.dangerous && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px]">
                        <select
                            id="perishable"
                            {...register('perishable', { required: true })}
                            className="custom-select"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                El producto es perecedero
                            </option>
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                        {errors.dangerous && <span>Este campo es obligatorio</span>}
                    </div>
                    <div className="mb-[15px]">
                        <input
                            type="text"
                            id="tariffPositional"
                            placeholder="Posicional Arancelaria"
                            {...register('tariffPositional', { required: true })}
                            className="custom-input"
                        />
                    </div>
                    <div className="mb-[15px]">
                        <select
                            id="commoditiesSection"
                            {...register('commoditiesSectionId', { required: true })}
                            className="custom-select"
                            defaultValue=""
                        >
                            <option
                                value=""
                                disabled
                                selected
                                className="text-[14px] font-light text-muted-foreground"
                            >
                                Seleccionar Sector
                            </option>
                            {commoditiesSection.map((section) => (
                                <option value={section.id} key={section.id}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
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
