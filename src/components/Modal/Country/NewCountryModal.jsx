'use client';

import { useState } from 'react';
import { useSettingContext } from '@/context/SettingContext';
import { createCountry } from '@/services/countryService';

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
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function NewCountryModal() {
    const { updateCities, updateCountries } = useSettingContext();

    const [code, setCode] = useState('');
    const [name, setName] = useState('');

    const handleCreateCountry = async (e) => {
        e.preventDefault();
        const countryData = {
            code,
            name,
        };
        const createdCountry = await createCountry(countryData);
        if (createdCountry) {
            updateCountries();
            updateCities();
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo País</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo país que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCountry}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Input
                            type="text"
                            placeholder="Codigo País"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                        />
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Input
                            type="text"
                            placeholder="Nombre País"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                            >
                                Crear País
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
