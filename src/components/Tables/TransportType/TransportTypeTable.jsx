'use client';

import { useEffect, useState, useCallback } from 'react';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import dynamic from 'next/dynamic';

import { getTransportType, deleteTransporteType } from '@/services/transportTypeService';
import { BtnDeleteTable, BtnEditTable } from '@/components/BtnTable/BtnTable';
import NewTransportType from '@/components/Modal/TransportType/NewTransportType';

import Swal from 'sweetalert2';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const DynamicEditTransportType = dynamic(
    () => import('@/components/Modal/TransportType/EditTransportType'),
    {
        ssr: false,
    }
);

export default function TransportTypeTable() {
    const [transportData, setTransportData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedTransportTypeId, setSelectedTransportTypeId] = useState(null);

    // GET DATA
    const fetchTransportType = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getTransportType();
            setTransportData(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransportType();
    }, [fetchTransportType]);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getTransportType();
        setTransportData(data);
    }, []);

    // DIALOG OPEN AND CLOSE
    const handleEditOpenModal = (id) => {
        setOpenEdit(true);
        setSelectedTransportTypeId(id);
    };
    const handleEditCloseModal = () => {
        setOpenEdit(false);
        setSelectedTransportTypeId(null);
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
                const success = await deleteTransporteType(id);
                if (success) {
                    await refreshTable();
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El tipo de transporte ha sido eliminado.',
                        icon: 'success',
                    });
                } else {
                    console.error('Error deleting shipping port');
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelado',
                    text: 'El tipo de transporte está a salvo :)',
                    icon: 'error',
                });
            }
        });
    }

    // COLUMNS TABLE
    const columns = [
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
                        Tipo de Transporte
                        <ArrowUpDown className="ml-2 h-[14px] w-[14px]" />
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
            const dataToExport = transportData.map((transportType) => ({
                name: transportType.name,
            }));
            console.log(dataToExport);
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'TransportType');
            XLSX.writeFile(workbook, 'transporttype_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">Transporte</h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewTransportType refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={transportData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openEdit && setSelectedTransportTypeId && (
                <DynamicEditTransportType
                    id={selectedTransportTypeId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
