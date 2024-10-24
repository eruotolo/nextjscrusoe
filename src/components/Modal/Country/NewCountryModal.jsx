'use client';

import { useState } from 'react';
import { createCountry } from '@/services/countryService';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

export default function NewCountryModal({ open, onClose, refresh }) {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleCreateCountry = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const countryData = {
                code,
                name,
            };
            const result = await createCountry(countryData);
            if (result) {
                console.log('Country created:', result.country);
            } else {
                console.error('Error:');
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
        <Dialog open={open} onOpenChange={onClose}>
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
                    {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={!isFormValid()}
                            className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                        >
                            Crear País
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
