'use client';

import { useEffect, useState, useCallback } from 'react';
import SingleTable from '@/components/TableGeneric/TableSingle';

import { getContacstByPartner, deleteContact } from '@/services/setting/contactsService';
import { BtnDeleteTable, BtnEditTable } from '@/components/BtnTable/BtnTable';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Plus } from 'lucide-react';

import NewContactModal from '@/components/Modal/Contacts/NewContactModal';

export default function ContactTable({ id }) {
    const [contactData, setContactData] = useState([]);
    const [selectedPartnerContact, setSelectedPartnerContact] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // GET OBTENGO TODOS LOS CONTACTOS
    const fetchContacts = useCallback(async () => {
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
        fetchContacts();
    }, [fetchContacts]);

    // REFRESH
    const refreshTable = useCallback(async () => {
        const data = await getContacstByPartner(id);
        setContactData(data);
    }, [id]);

    // DELETE CONTACT
    const deleteContactById = useCallback(
        async (contactId) => {
            try {
                await deleteContact(contactId);
                await refreshTable();
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
        {
            accessorKey: 'action',
            size: 120,
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <BtnEditTable />
                    <BtnDeleteTable onClick={() => deleteContactById(row.original.id)} />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">Contactos</h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewContactModal refresh={refreshTable} partnerId={id} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <SingleTable columns={columns} data={contactData} loading={isLoading} />
            </div>
        </>
    );
}
