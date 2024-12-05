'use client';

import { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

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
                        <input
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Nombre del Rol"
                            className="custom-input"
                        />
                        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                    </div>
                    <DialogFooter>
                        <button type="submit" disabled={!isFormValid()} className="custom-button">
                            Crear Rol
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
