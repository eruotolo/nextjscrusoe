'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSettingContext } from '@/context/SettingContext';
import { getCities, getAllCities, deleteCity } from '@/services/cityService';
import TableGenericLarge from '@/components/TableGeneric/TableGenericLarge';
import EditCityModal from '@/components/Modal/Country/EditCityModal';
import { FilePenLine, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

import Swal from 'sweetalert2';

export default function CityTable() {
    const [citiesData, setCitiesData] = useState({ data: [], meta: {} });
    const { updateCities } = useSettingContext();

    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const fetchCities = useCallback(async (page = 1, search = '') => {
        setIsLoading(true);
        const result = await getCities({ search, page, pageSize: 9 });
        setCitiesData(result);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchCities(currentPage, globalFilter);
    }, [currentPage, globalFilter, fetchCities, updateCities]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleGlobalFilterChange = (value) => {
        setGlobalFilter(value);
        setCurrentPage(1);
    };

    // Eliminar Ciudad
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
                const success = await deleteCity(id);
                if (success) {
                    setCitiesData((prevData) => ({
                        ...prevData,
                        data: prevData.data.filter((city) => city.id !== id),
                        meta: {
                            ...prevData.meta,
                            total: prevData.meta.total - 1,
                            totalPages: Math.ceil(
                                (prevData.meta.total - 1) / prevData.meta.pageSize
                            ),
                        },
                    }));

                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'La ciudad ha sido eliminada.',
                        icon: 'success',
                    });
                } else {
                    console.error('Error deleting city');
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelado',
                    text: 'La ciudad está a salvo :)',
                    icon: 'error',
                });
            }
        });
    }

    // Columnas de la Tabla.
    const columns = [
        {
            accessorKey: 'name',
            size: 280,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[12px] font-normal leading-[13px] text-[#8D8989] 2xl:text-[13px]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Nombre Ciudad
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'country.name',
            size: 280,
            header: 'País',
        },
        {
            accessorKey: 'action',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <EditCityModal id={row.original.id} />

                    <button onClick={() => handleDelete(row.original.id)}>
                        <Trash2 className="h-[18px] w-[18px] hover:text-verde" />
                    </button>
                </div>
            ),
        },
    ];

    // Exportación de Archivo Excel
    const exportToExcel = async () => {
        setIsExporting(true);
        try {
            const allCities = await getAllCities(globalFilter);
            const dataToExport = allCities.map((city) => ({
                countryCode: city.countryCode,
                countryName: city.country.name,
                cityId: city.id,
                cityName: city.name,
            }));
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Ciudades');
            XLSX.writeFile(workbook, 'ciudades_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div>
            <TableGenericLarge
                columns={columns}
                data={citiesData.data}
                loading={isLoading}
                exportToExcel={exportToExcel}
                isExporting={isExporting}
                pagination={{
                    currentPage,
                    totalPages: citiesData.meta.totalPages,
                    onPageChange: handlePageChange,
                }}
                globalFilter={globalFilter}
                onGlobalFilterChange={handleGlobalFilterChange}
            />
        </div>
    );
}
