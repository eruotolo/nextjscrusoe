'use client';

import { useEffect, useState, useCallback } from 'react';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import dynamic from 'next/dynamic';

import { getTraffics, deleteTraffics } from '@/services/setting/trafficsService';
import { BtnEditTable } from '@/components/BtnTable/BtnTable';
import DeleteConfirmationSweet from '@/components/DeleteConfirmationSweet/DeleteConfirmationSweet';
import NewTraffics from '@/components/Modal/Traffics/NewTraffics';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const DynamicEditTraffics = dynamic(() => import('@/components/Modal/Traffics/EditTraffics'), {
    ssr: false,
});

export default function TrafficsTable() {
    const [trafficsData, setTrafficsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedTrafficsId, setSelectedTrafficsId] = useState(null);

    // GET DATA
    const fetchTraffics = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getTraffics();
            setTrafficsData(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTraffics();
    }, [fetchTraffics]);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getTraffics();
        setTrafficsData(data);
    }, []);

    // DIALOG OPEN AND CLOSE
    const handleEditOpenModal = (id) => {
        setOpenEdit(true);
        setSelectedTrafficsId(id);
    };
    const handleEditCloseModal = () => {
        setOpenEdit(false);
        setSelectedTrafficsId(null);
    };

    // COLUMNS TABLE
    const columns = [
        {
            accessorKey: 'code',
            size: '100',
            header: 'Código',
            cell: ({ row }) => (row.original.code ? row.original.code : 'S/N'),
        },
        {
            accessorKey: 'name',
            size: 200,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[12px] font-medium leading-[13px] text-[#8D8989]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Nombre Español
                        <ArrowUpDown className="ml-2 h-[14px] w-[14px]" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'nameEnglish',
            size: 200,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[12px] font-medium leading-[13px] text-[#8D8989]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Nombre Ingles
                        <ArrowUpDown className="ml-2 h-[14px] w-[14px]" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'updatedAt',
            size: 100,
            header: 'Ultima Edición',
            cell: ({ row }) => {
                const date = row.original.updatedAt || row.original.createdAt;
                if (date) {
                    // Asegurarse de que la fecha sea un objeto Date válido
                    const dateObject = new Date(date);
                    if (isNaN(dateObject.getTime())) {
                        return 'Fecha inválida';
                    }
                    return dateObject.toLocaleString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                }
                return 'Fecha no disponible';
            },
        },
        {
            accessorKey: 'user',
            size: 100,
            header: 'Editado por...',
            cell: ({ row }) =>
                `${row.original.user?.name || ''} ${row.original.user?.lastName || ''}`,
        },
        {
            accessorKey: 'action',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <BtnEditTable onClick={() => handleEditOpenModal(row.original.id)} />

                    <DeleteConfirmationSweet
                        id={row.original.id}
                        deleteFunction={deleteTraffics}
                        refreshFunction={refreshTable}
                        itemName="Ships"
                    />
                </div>
            ),
        },
    ];

    // EXPORT TO EXCEL
    const exportToExcel = async () => {
        try {
            const dataToExport = trafficsData.map((traffics) => ({
                code: traffics.code,
                name: traffics.name,
                nameEnglish: traffics.nameEnglish,
                userName: traffics.user.name,
                userLastName: traffics.user.lastName,
            }));
            console.log(dataToExport);
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Traffics');
            XLSX.writeFile(workbook, 'traffics_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">Trafico</h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewTraffics refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={trafficsData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openEdit && setSelectedTrafficsId && (
                <DynamicEditTraffics
                    id={selectedTrafficsId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
