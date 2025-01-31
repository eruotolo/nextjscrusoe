'use client';

import { useEffect, useState, useCallback } from 'react';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import dynamic from 'next/dynamic';

import { getShips, deleteShips } from '@/services/setting/shipsService';
import { BtnEditTable } from '@/components/BtnTable/BtnTable';
import DeleteConfirmationSweet from '@/components/DeleteConfirmationSweet/DeleteConfirmationSweet';

import NewShips from '@/components/Modal/Ships/NewShips';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const DynamicEditShips = dynamic(() => import('@/components/Modal/Ships/EditShips'), {
    ssr: false,
});

export default function ShipsTable() {
    const [shipsData, setShipsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedShipsId, setSelectedShipsId] = useState(null);

    // GET DATA
    const fetchShips = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getShips();
            setShipsData(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShips();
    }, [fetchShips]);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getShips();
        setShipsData(data);
    }, []);

    // DIALOG OPEN CLOSE
    const handleEditOpenModal = (id) => {
        setSelectedShipsId(id);
        setOpenEdit(true);
    };
    const handleEditCloseModal = () => {
        setSelectedShipsId(null);
        setOpenEdit(false);
    };

    // COLUMNAS
    const columns = [
        {
            accessorKey: 'code',
            size: 150,
            header: 'Código de Barco',
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
                        Nombre del Buque
                        <ArrowUpDown className="ml-2 h-[14px] w-[14px]" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'shipowner.name',
            size: 150,
            header: 'Armador',
        },
        {
            accessorKey: 'country.name',
            size: 140,
            header: 'Bandera',
        },
        {
            accessorKey: 'shipsType.name',
            size: 140,
            header: 'Tipo',
        },
        {
            accessorKey: 'action',
            size: 120,
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <BtnEditTable onClick={() => handleEditOpenModal(row.original.id)} />
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

    // EXPORT TO EXCEL
    const exportToExcel = async () => {
        try {
            const dataToExport = shipsData.map((ships) => ({
                name: ships.name,
                code: ships.code,
                shipowner: ships.shipowner.name,
                country: ships.country.name,
                shipsType: ships.shipsType.name,
            }));
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Ships');
            XLSX.writeFile(workbook, 'ships_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">Buques</h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewShips refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={shipsData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openEdit && setSelectedShipsId && (
                <DynamicEditShips
                    id={selectedShipsId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
