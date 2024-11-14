'use client';

import { useEffect, useState, useCallback } from 'react';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import dynamic from 'next/dynamic';

import { getIncoterms } from '@/services/incotermsService';
import { BtnDeleteTable, BtnEditTable, BtnAssign } from '@/components/BtnTable/BtnTable';
import NewIncotermsModal from '@/components/Modal/Incoterms/NewIncotermsModal';

import Swal from 'sweetalert2';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

export default function IncotermsTable() {
    const [incotermsData, setIncotermsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedIncotermsId, setSelectedIncotermsId] = useState(null);

    //GET DATA
    const fetchIncoterms = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getIncoterms();
            setIncotermsData(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIncoterms();
    }, [fetchIncoterms]);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getIncoterms();
        setIncotermsData(data);
    });

    //DIALOG OPEN AND CLOSE
    const handleEditOpenModal = (id) => {
        setOpenEdit(true);
        setSelectedIncotermsId(id);
    };
    const handleEditCloseModal = () => {
        setOpenEdit(false);
        setSelectedIncotermsId(null);
    };

    // COLUMNS TABLE
    const columns = [
        {
            accessorKey: 'code',
            size: 120,
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
                        Nombre Incoterms
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'transportType',
            header: 'Tipo de transporte',
            cell: ({ row }) => (
                <div>
                    {row.original.transportRelation.length > 0
                        ? row.original.transportRelation.map((transportType, index) => (
                              <span key={index} className="text-[12px] leading-[18px]">
                                  {transportType.transportType.name}
                                  {index < row.original.transportRelation.length - 1 ? ', ' : ''}
                              </span>
                          ))
                        : 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: 'action',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <BtnEditTable />
                    <BtnAssign />
                    <BtnDeleteTable />
                </div>
            ),
        },
    ];

    // EXPORTACIÓN ARCHIVO EXCEL
    const exportToExcel = () => {
        const combinedData = incotermsData.map((incoterms) => ({
            code: incoterms.code,
            name: incoterms.name,
            transportType:
                incoterms.transportRelation.length > 0
                    ? incoterms.transportRelation
                          .map((relation) => relation.transportType.name)
                          .join(', ')
                    : 'N/A',
        }));

        // Crear hoja de trabajo a partir de los datos combinados
        const worksheet = XLSX.utils.json_to_sheet(combinedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Incoterms');
        // Exportar archivo Excel
        XLSX.writeFile(workbook, 'incoterms_combined.xlsx');
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                        Listado de tipo de incoterms
                    </h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewIncotermsModal refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={incotermsData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
        </>
    );
}
