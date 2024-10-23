'use client';

import { useState } from 'react';
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

export default function NewRoleModal({ open, onClose, refresh }) {
    const [roleName, setRoleName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: roleName }),
            });

            if (res.ok) {
                console.log('Role created successfully');
                await refresh();
                resetForm();
                onClose();
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Error al crear el rol');
            }
        } catch (error) {
            setError('Error de red al crear el rol');
            console.error('Error creating role:', error);
        }
    };

    const resetForm = () => {
        setRoleName('');
    };

    const isFormValid = () => {
        return roleName.trim() !== '';
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Rol</DialogTitle>
                    <DialogDescription>
                        Introduce el nombre del nuevo rol que deseas crear.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Input
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Nombre del rol"
                            className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                        />
                        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={!isFormValid()}
                            className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                        >
                            Crear Rol
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
