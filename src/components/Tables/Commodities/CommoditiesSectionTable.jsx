'use client';

import { useEffect, useState, useCallback } from 'react';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import dynamic from 'next/dynamic';

import {
    getCommoditiesSection,
    deleteCommoditiesSection,
} from '@/services/setting/commoditiesSectionService';
import { BtnEditTable } from '@/components/BtnTable/BtnTable';
import DeleteConfirmationSweet from '@/components/DeleteConfirmationSweet/DeleteConfirmationSweet';
import NewCommoditiesSection from '@/components/Modal/Commodities/NewCommoditiesSection';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const DynamicEditCommoditiesSection = dynamic(
    () => import('@/components/Modal/Commodities/EditCommoditiesSection'),
    {
        ssr: false,
    }
);

export default function CommoditiesSectionTable() {
    const [commoditiesSectionData, setCommoditiesSectionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCommoditiesSectionId, setSelectedCommoditiesSectionId] = useState(null);

    // GET DATA
    const fetchCommoditiesSection = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getCommoditiesSection();
            setCommoditiesSectionData(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCommoditiesSection();
    }, [fetchCommoditiesSection]);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getCommoditiesSection();
        setCommoditiesSectionData(data);
    }, []);

    // DIALOG OPEN AND CLOSE
    const handleEditOpenModal = (id) => {
        setOpenEdit(true);
        setSelectedCommoditiesSectionId(id);
    };
    const handleEditCloseModal = () => {
        setOpenEdit(false);
        setSelectedCommoditiesSectionId(null);
    };

    // COLUMNAS
    const columns = [
        {
            accessorKey: 'name',
            size: 280,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[12px] font-medium leading-[13px] text-[#8D8989]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Sector
                        <ArrowUpDown className="ml-2 h-[14px] w-[14px]" />
                    </Button>
                );
            },
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
                        deleteFunction={deleteCommoditiesSection}
                        refreshFunction={refreshTable}
                        itemName="Sector"
                    />
                </div>
            ),
        },
    ];

    // EXPORT TO EXCEL
    const exportToExcel = async () => {
        try {
            const dataToExport = commoditiesSectionData.map((commoditiesSection) => ({
                name: commoditiesSection.name,
            }));
            console.log(dataToExport);
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'CommoditiesSection');
            XLSX.writeFile(workbook, 'commoditiesSection_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">Sectores</h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewCommoditiesSection refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={commoditiesSectionData}
                    isLoading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openEdit && setSelectedCommoditiesSectionId && (
                <DynamicEditCommoditiesSection
                    id={selectedCommoditiesSectionId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
