'use client';

import { useEffect, useState } from 'react';
import { getRoles } from '@/services/roleService';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

export default function AssignRoleUserModal({ id, refresh, open, onClose }) {
    const [roleData, setRoleData] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        // Fetch all roles
        getRoles()
            .then((data) => setRoleData(data))
            .catch((error) => console.error('Error fetching roles:', error));
    }, []);

    useEffect(() => {
        // Fetch user's current roles
        fetch(`/api/users/${id}/roles`)
            .then((res) => res.json())
            .then((data) => {
                setUserRoles(data);
                setSelectedRoles(data.map((role) => role.id));
            })
            .catch((error) => console.error('Error fetching user roles:', error));
    }, [id]);

    const handleRoleChange = (roleId) => {
        setSelectedRoles((prevSelectedRoles) =>
            prevSelectedRoles.includes(roleId)
                ? prevSelectedRoles.filter((id) => id !== roleId)
                : [...prevSelectedRoles, roleId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/users/${id}/roles`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roles: selectedRoles }),
            });

            if (res.ok) {
                console.log('Roles updated successfully');
                await refresh();
                onClose();
            } else {
                const errorData = await res.json();
                console.error('Error updating roles:', errorData);
            }
        } catch (error) {
            console.error('Error updating roles:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Asignar Permisos y Roles</DialogTitle>
                    <DialogDescription>
                        Configura los permisos y roles del usuario para determinar su nivel de
                        acceso y las acciones que puede realizar en el sistema.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        {roleData.map((role) => (
                            <div key={role.id} className="flex items-center px-4 py-1">
                                <input
                                    type="checkbox"
                                    id={`role-${role.id}`}
                                    checked={selectedRoles.includes(role.id)}
                                    onChange={() => handleRoleChange(role.id)}
                                    className={`mr-2 h-4 w-4 ${
                                        selectedRoles.includes(role.id)
                                            ? 'checked:accent-[#2E5D6D]'
                                            : ''
                                    }`}
                                />
                                <label
                                    htmlFor={`role-${role.id}`}
                                    className="text-[15px] text-gris"
                                >
                                    {role.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                        >
                            Actualizar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}