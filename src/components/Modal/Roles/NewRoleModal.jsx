'use client';

import { useState } from 'react';
import { useSettingContext } from '@/context/SettingContext';

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

export default function NewRoleModal() {
    const { updateRoles, updateUsers } = useSettingContext();

    const [roleName, setRoleName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                setRoleName(''); // Clear the input field
                updateRoles(); // Update the roles list
                updateUsers(); // Update the users list (if needed)
            } else {
                const errorData = await res.json();
                console.error('Error creating role:', errorData);
            }
        } catch (error) {
            console.error('Error creating role:', error);
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
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                            >
                                Crear Rol
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
