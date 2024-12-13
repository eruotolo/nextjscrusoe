'use client';

import { useEffect, useState, useCallback } from 'react';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import dynamic from 'next/dynamic';

import { getCommodities, deleteCommodities } from '@/services/setting/commoditiesService';
import { BtnEditTable } from '@/components/BtnTable/BtnTable';
import DeleteConfirmationSweet from '@/components/DeleteConfirmationSweet/DeleteConfirmationSweet';

import NewCommodities from '@/components/Modal/Commodities/NewCommodities';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const DynamicEditCommodities = dynamic(
    () => import('@/components/Modal/Commodities/EditCommodities'),
    { ssr: false }
);

export default function CommoditiesTable() {
    const [commoditiesData, setCommoditiesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCommoditiesId, setSelectedCommoditiesId] = useState(null);

    // GET DATA
    const fetchCommodities = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getCommodities();
            setCommoditiesData(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCommodities();
    }, [fetchCommodities]);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getCommodities();
        setCommoditiesData(data);
    }, []);

    // DIALOG OPEN CLOSE
    const handleEditOpenModal = (id) => {
        setSelectedCommoditiesId(id);
        setOpenEdit(true);
    };
    const handleEditCloseModal = () => {
        setSelectedCommoditiesId(null);
        setOpenEdit(false);
    };

    const columns = [
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
            accessorKey: 'dangerous',
            size: '100',
            header: 'Peligroso',
            cell: ({ row }) => (row.original.dangerous ? 'Sí' : 'No'),
        },
        {
            accessorKey: 'perishable',
            size: '100',
            header: 'Perecedero',
            cell: ({ row }) => (row.original.perishable ? 'Sí' : 'No'),
        },
        {
            accessorKey: 'commoditiesSection.name',
            size: '100',
            header: 'Sector',
        },
        {
            accessorKey: 'tariffPositional',
            size: '100',
            header: 'Posición Arancelaria',
        },
        {
            accessorKey: 'action',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <BtnEditTable onClick={() => handleEditOpenModal(row.original.id)} />

                    <DeleteConfirmationSweet
                        id={row.original.id}
                        deleteFunction={deleteCommodities}
                        refreshFunction={refreshTable}
                        itemName="Ships"
                    />
                </div>
            ),
        },
    ];

    // EXPORT TO EXCEL
    const exportToExcel = () => {
        try {
            const dataToExport = commoditiesData.map((commodities) => ({
                name: commodities.name,
                nameIngles: commodities.nameEnglish,
                dangerous: commodities.dangerous,
                perishable: commodities.perishable,
                tariffPositional: commodities.tariffPositional,
                commoditiesSection: commodities.commoditiesSection.name,
            }));
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Commodities');
            XLSX.writeFile(workbook, 'commodities_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                        Commodities
                    </h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewCommodities refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={commoditiesData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openEdit && setSelectedCommoditiesId && (
                <DynamicEditCommodities
                    id={selectedCommoditiesId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
