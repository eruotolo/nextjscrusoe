'use client';

import { useEffect, useState, useCallback } from 'react';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import NewPartnerModal from '@/components/Modal/Partner/NewPartnerModal';

import { getPartner, deletePartner } from '@/services/setting/partnerService';
import {
    BtnEditTable,
    BtnCredit,
    BtnContact,
    BtnViewTable,
    BtnAssign,
} from '@/components/BtnTable/BtnTable';
import DeleteConfirmationSweet from '@/components/DeleteConfirmationSweet/DeleteConfirmationSweet';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const DynamicTableContact = dynamic(
    () => import('@/components/Tables/Contact/ContactSingleTable'),
    {
        ssr: false,
    }
);

const DynamicAssignSupplierType = dynamic(
    () => import('@/components/Modal/Partner/AssignShupplierType'),
    { ssr: false }
);

const DynamicModalCredit = dynamic(() => import('@/components/Modal/Partner/ViewCreditInfoModal'), {
    ssr: false,
});

const DynamicEditPartnerModal = dynamic(
    () => import('@/components/Modal/Partner/EditPartnerModal'),
    { ssr: false }
);

export default function PartnerTable() {
    const [partnerData, setPartnerData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPartnerId, setSelectedPartnerId] = useState(null);

    const [openEdit, setOpenEdit] = useState(false);
    const [openContact, setOpenContact] = useState(false);
    const [openCredit, setOpenCredit] = useState(false);
    const [openAssignSupplier, setOpenAssignSupplier] = useState(false);

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
    const handleEditOpenModal = (id) => {
        setSelectedPartnerId(id);
        setOpenEdit(true);
    };
    const handleEditCloseModal = () => {
        setSelectedPartnerId(false);
        setOpenEdit(null);
    };

    const handleContactOpenModal = (id) => {
        setOpenContact(true);
        setSelectedPartnerId(id);
    };
    const handleContactCloseModal = () => {
        setOpenContact(false);
        setSelectedPartnerId(null);
    };

    const handleCreditOpenModal = (id) => {
        setOpenCredit(true);
        setSelectedPartnerId(id);
    };
    const handleCreditCloseModal = () => {
        setOpenCredit(false);
        setSelectedPartnerId(null);
    };

    const handleAssignSupplierOpenModal = (id) => {
        setOpenAssignSupplier(true);
        setSelectedPartnerId(id);
    };
    const handleAssignSupplierCloseModal = () => {
        setOpenAssignSupplier(false);
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
            cell: ({ row }) => {
                const partnerType = row.original.partnerType.name;
                const showCreditButton =
                    partnerType === 'Cliente' ||
                    partnerType === 'Agente' ||
                    partnerType === 'Proveedor' ||
                    partnerType === 'Mixto';

                const showAssignButton = partnerType === 'Proveedor';

                return (
                    <div className="flex items-center justify-end space-x-3">
                        <Link href={`/setting/partners/${row.original.id}`}>
                            <BtnViewTable />
                        </Link>

                        <BtnEditTable onClick={() => handleEditOpenModal(row.original.id)} />

                        {showCreditButton && (
                            <BtnCredit
                                text="Ver Credito"
                                onClick={() => handleCreditOpenModal(row.original.id)}
                            />
                        )}

                        {showAssignButton && (
                            <BtnAssign
                                text="Asignar Proveedor"
                                onClick={() => handleAssignSupplierOpenModal(row.original.id)}
                            />
                        )}

                        <BtnContact onClick={() => handleContactOpenModal(row.original.id)} />

                        <DeleteConfirmationSweet
                            id={row.original.id}
                            deleteFunction={deletePartner}
                            refreshFunction={refreshTable}
                            itemName="Socio"
                        />
                    </div>
                );
            },
        },
    ];

    const exportToExcel = async () => {
        try {
            const combinedData = partnerData.map((partner) => ({
                id: partner.id,
                partnerType: partner.partnerType?.name || 'N/A',
                name: partner.name,
                socialReazon: partner.socialReazon,
                rut: partner.rut,
                scacCode: partner.scacCode,
                taxId: partner.taxId,
                email: partner.email,
                phone: partner.phone,
                address: partner.address,
                zipCode: partner.zipCode,
                locations: partner.locations,
                countryName: partner.country?.name || 'N/A',
                cityName: partner.city?.name || 'N/A',
            }));
            //console.log('Combinado:', combinedData);
            // Crear hoja de trabajo a partir de los datos combinados
            const worksheet = XLSX.utils.json_to_sheet(combinedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Partner');
            // Exportar archivo Excel
            XLSX.writeFile(workbook, 'partner_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                        Socios Comerciales
                    </h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewPartnerModal refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={partnerData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openEdit && selectedPartnerId && (
                <DynamicEditPartnerModal
                    id={selectedPartnerId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
            {openContact && setSelectedPartnerId && (
                <DynamicTableContact
                    id={selectedPartnerId}
                    open={openContact}
                    onClose={handleContactCloseModal}
                />
            )}
            {openCredit && setSelectedPartnerId && (
                <DynamicModalCredit
                    id={selectedPartnerId}
                    open={openCredit}
                    onClose={handleCreditCloseModal}
                />
            )}
            {openAssignSupplier && setSelectedPartnerId && (
                <DynamicAssignSupplierType
                    id={selectedPartnerId}
                    open={openAssignSupplier}
                    refresh={refreshTable}
                    onClose={handleAssignSupplierCloseModal}
                />
            )}
        </>
    );
}
