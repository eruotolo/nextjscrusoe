'use client';

import { useEffect, useState, useCallback } from 'react';
import SingleTable from '@/components/TableGeneric/TableSingle';

import { getContacstByPartner, deleteContact } from '@/services/setting/contactsService';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Plus } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ContactSingleTable({ id, open, onClose }) {
    const [contactData, setContactData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // GET OBTENGO TODOS LOS CONTACTOS
    const fetchContact = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getContacstByPartner(id);
            setContactData(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchContact();
    }, [fetchContact]);

    // COLUMNAS DE LA TABLA
    const columns = [
        {
            accessorKey: 'contactType.name',
            size: 100,
            header: 'Tipo',
        },
        {
            accessorKey: 'name',
            size: 150,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[12px] font-medium leading-[13px] text-[#8D8989]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Nombre
                        <ArrowUpDown className="ml-2 h-[14px] w-[14px]" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'email',
            size: 150,
            header: 'Email',
        },
        {
            accessorKey: 'phone',
            size: 100,
            header: 'Teléfono',
        },
    ];

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[900px]">
                    <DialogHeader>
                        <DialogTitle>Contactos Asociados al Socio</DialogTitle>
                    </DialogHeader>

                    <SingleTable columns={columns} data={contactData} loading={isLoading} />
                </DialogContent>
            </Dialog>
        </>
    );
}
