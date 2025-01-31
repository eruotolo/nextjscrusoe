'use client';

import { useEffect, useState, useCallback } from 'react';
import SingleTable from '@/components/TableGeneric/TableSingle';
import dynamic from 'next/dynamic';

import { getContacstByPartner, deleteContact } from '@/services/setting/contactsService';
import { BtnEditTable } from '@/components/BtnTable/BtnTable';
import DeleteConfirmationSweet from '@/components/DeleteConfirmationSweet/DeleteConfirmationSweet';

import NewContactModal from '@/components/Modal/Contacts/NewContactModal';

import { Button } from '@/components/ui/button';
import { ArrowUpDown, Plus } from 'lucide-react';

const DynamicEditContacto = dynamic(() => import('@/components/Modal/Contacts/EditContactModal'), {
    ssr: false,
});

export default function ContactTable({ id }) {
    const [contactData, setContactData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);

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

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getContacstByPartner(id);
        setContactData(data);
    }, [id]);

    // DIALOG OPEN CLOSE
    const handleEditOpenModal = (id) => {
        setSelectedContactId(id);
        setOpenEdit(true);
    };
    const handleEditCloseModal = () => {
        setSelectedContactId(null);
        setOpenEdit(false);
    };

    // COLUMNAS DE LA TABLA
    const columns = [
        {
            accessorKey: 'contactType.name',
            header: 'Tipo',
        },
        {
            accessorKey: 'name',
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
            header: 'Email',
        },
        {
            accessorKey: 'phone',
            header: 'Teléfono',
        },
        {
            accessorKey: 'action',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <BtnEditTable onClick={() => handleEditOpenModal(row.original.id)} />
                    {/*<BtnDeleteTable onClick={() => deleteContactById(row.original.id)} />*/}

                    <DeleteConfirmationSweet
                        id={row.original.id}
                        deleteFunction={deleteContact}
                        refreshFunction={refreshTable}
                        itemName="Contacto"
                    />
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
            {openEdit && setSelectedContactId && (
                <DynamicEditContacto
                    id={selectedContactId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
