'use client';

import { useState } from 'react';
import { createCountry } from '@/services/setting/countryService';

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
export default function NewCountryModal({ refresh }) {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleCreateCountry = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const countryData = {
                code: code,
                name: name,
            };
            console.log('Datos Antes:', countryData);

            const createdCountry = await createCountry(countryData);
            if (createdCountry) {
                //console.log('Hola');
                await refresh();
                resetForm();
            }
        } catch (error) {
            setError('Error de red al crear el país');
            console.error('Error creating país', error);
        }
    };

    const resetForm = () => {
        setCode('');
        setName('');
    };

    const isFormValid = () => {
        return name && code;
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo País</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo país que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCountry}>
                    <div className="grid grid-cols-3">
                        <div className="col-span-1 mb-[15px] mr-[5px]">
                            <input
                                type="text"
                                placeholder="Codigo País"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="custom-input"
                            />
                        </div>
                        <div className="col-span-2 mb-[15px] ml-[5px]">
                            <input
                                type="text"
                                placeholder="Nombre País"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="custom-input"
                            />
                        </div>
                    </div>

                    {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                    <DialogFooter>
                        <DialogClose asChild>
                            <button
                                type="submit"
                                disabled={!isFormValid()}
                                className="custom-button"
                            >
                                Crear País
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
