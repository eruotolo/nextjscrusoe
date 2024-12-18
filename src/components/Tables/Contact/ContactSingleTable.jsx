'use client';

import { useEffect, useState, useCallback } from 'react';
import SingleTable from '@/components/TableGeneric/TableSingle';

import { getContact, deleteContact } from '@/services/setting/contactService';
import { BtnDeleteTable, BtnEditTable } from '@/components/BtnTable/BtnTable';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Plus } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function ContactSingleTable({ id, refresh, open, onClose }) {
    const [contactData, setContactData] = useState([]);
    const [selectedPartnerContact, setSelectedPartnerContact] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditContactForm, setShowEditContactForm] = useState(false);
    const [showNewContactForm, setShowNewContactForm] = useState(false);

    // GET OBTENGO TODOS LOS CONTACTOS
    const fetchContact = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getContact();
            setContactData(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContact();
    }, [fetchContact]);

    // OBTENGO LOS CONTACTOS ASOCIADOS AL SOCIO
    useEffect(() => {
        const fetchPartnerContact = async () => {
            try {
                const response = await fetch(`/api/partner/${id}/contacts`);
                const data = await response.json();
                setSelectedPartnerContact(data.map((relation) => relation.contactId));
            } catch (error) {
                console.error('Error fetching partner contacts:', error);
            }
        };
        if (open) {
            fetchPartnerContact();
        }
    }, [open, id]);

    // FILTRAR CONTACTOS ASOCIADOS
    const filteredContactData = contactData.filter((contact) =>
        selectedPartnerContact.includes(contact.id)
    );

    // REFRESH
    const refreshTable = useCallback(async () => {
        const data = await getContact();
        setContactData(data);
    });

    // DELETE CONTACT
    const deleteContactById = useCallback(
        async (contactId) => {
            try {
                await deleteContact(contactId);
                refreshTable();
            } catch (error) {
                console.error('Error deleting contact:', error);
            }
        },
        [refreshTable]
    );

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

                    <SingleTable columns={columns} data={filteredContactData} loading={isLoading} />
                </DialogContent>
            </Dialog>
        </>
    );
}
