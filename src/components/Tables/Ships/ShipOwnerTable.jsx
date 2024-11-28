'use client';

import { useEffect, useState, useCallback } from 'react';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import dynamic from 'next/dynamic';

import { getShipOwner, deleteShipOwner } from '@/services/shipOwnerService';
import { BtnDeleteTable, BtnEditTable } from '@/components/BtnTable/BtnTable';
import NewShipOwner from '@/components/Modal/Ships/NewShipOwner';

import Swal from 'sweetalert2';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const DynamicEditShipOwner = dynamic(() => import('@/components/Modal/Ships/EditShipOwner'), {
    ssr: false,
});

export default function ShipOwnerTable() {
    const [shipOwnerData, setShipOwnerData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [seletedShipOwnerId, setSeletedShipOwnerId] = useState(null);

    //GET DATA
    const fetchShipOwner = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getShipOwner();
            setShipOwnerData(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShipOwner();
    }, [fetchShipOwner]);

    //REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getShipOwner();
        setShipOwnerData(data);
    }, []);

    //DIALOG OPEN AND CLOSE

    const handleEditOpenModal = (id) => {
        setOpenEdit(true);
        setSeletedShipOwnerId(id);
    };
    const handleEditCloseModal = () => {
        setOpenEdit(false);
        setSeletedShipOwnerId(null);
    };

    // DELETE SHIPPINGPORT
    async function handleDelete(id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esta acción!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await deleteShipOwner(id);
                if (success) {
                    await refreshTable();
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El ShipOwner ha sido eliminado.',
                        icon: 'success',
                    });
                } else {
                    console.error('Error deleting ShipOwner');
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelado',
                    text: 'El ShipOwner está a salvo :)',
                    icon: 'error',
                });
            }
        });
    }

    // COLUMNS TABLE
    const columns = [
        {
            accessorKey: 'code',
            size: 50,
            header: 'Código',
        },
        {
            accessorKey: 'name',
            size: 300,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[12px] font-medium leading-[13px] text-[#8D8989]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Armador/Shipowner
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'action',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <BtnEditTable onClick={() => handleEditOpenModal(row.original.id)} />
                    <BtnDeleteTable onClick={() => handleDelete(row.original.id)} />
                </div>
            ),
        },
    ];

    // EXPORT TO EXCEL
    const exportToExcel = async () => {
        try {
            const dataToExport = shipOwnerData.map((shipOwner) => ({
                code: shipOwner.code,
                name: shipOwner.name,
            }));
            console.log(dataToExport);
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'ShipOwner');
            XLSX.writeFile(workbook, 'shipowner_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                        Armadores/Shipowner
                    </h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewShipOwner refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={shipOwnerData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openEdit && setSeletedShipOwnerId && (
                <DynamicEditShipOwner
                    id={seletedShipOwnerId}
                    open={openEdit}
                    refresh={refreshTable}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
