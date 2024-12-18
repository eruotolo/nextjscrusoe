'use client';

import { useEffect, useState, useCallback } from 'react';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { getPartner } from '@/services/setting/partnerService';
import { BtnEditTable, BtnCredit, BtnContact, BtnViewTable } from '@/components/BtnTable/BtnTable';
import DeleteConfirmationSweet from '@/components/DeleteConfirmationSweet/DeleteConfirmationSweet';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { deleteShips } from '@/services/setting/shipsService';

const DynamicTableContact = dynamic(
    () => import('@/components/Tables/Contact/ContactSingleTable'),
    {
        ssr: false,
    }
);

export default function PartnerTable() {
    const [partnerData, setPartnerData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPartnerId, setSelectedPartnerId] = useState(null);

    const [openEdit, setOpenEdit] = useState(false);
    const [openContact, setOpenContact] = useState(false);

    // GET DATA
    const fetchPartner = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getPartner();
            setPartnerData(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPartner();
    }, [fetchPartner]);

    // REFFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getPartner();
        setPartnerData(data);
    }, []);

    //DIALOG OPEN AND CLOSE
    const handleContactOpenModal = (id) => {
        setOpenContact(true);
        setSelectedPartnerId(id);
    };
    const handleContactCloseModal = () => {
        setOpenContact(false);
        setSelectedPartnerId(null);
    };

    // COLUMNAS
    const columns = [
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
            accessorKey: 'socialReazon',
            size: 150,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[12px] font-medium leading-[13px] text-[#8D8989]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Razón Social
                        <ArrowUpDown className="ml-2 h-[14px] w-[14px]" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'rut',
            size: 150,
            header: 'Rut',
        },
        {
            accessorKey: 'address',
            size: 150,
            header: 'Dirección',
        },
        {
            accessorKey: 'partnerType.name',
            size: 159,
            header: 'Tipo de Socio',
        },
        {
            accessorKey: 'action',
            size: 120,
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <BtnViewTable />

                    <Link href={`/setting/partners/${row.original.id}`}>
                        <BtnEditTable />
                    </Link>

                    <BtnCredit />

                    <BtnContact onClick={() => handleContactOpenModal(row.original.id)} />

                    <DeleteConfirmationSweet
                        id={row.original.id}
                        deleteFunction={deleteShips}
                        refreshFunction={refreshTable}
                        itemName="Ships"
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                        Socios Comerciales
                    </h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>Nuevo +</div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable columns={columns} data={partnerData} loading={isLoading} />
            </div>
            {openContact && setSelectedPartnerId && (
                <DynamicTableContact
                    id={selectedPartnerId}
                    open={openContact}
                    onClose={handleContactCloseModal}
                />
            )}
        </>
    );
}
