'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCities, deleteCity } from '@/services/setting/cityService';
import dynamic from 'next/dynamic';

import GenericTable from '@/components/TableGeneric/TableGeneric';
import { BtnDeleteTable, BtnEditTable } from '@/components/BtnTable/BtnTable';
import NewCityModal from '@/components/Modal/Country/NewCityModal';

import Swal from 'sweetalert2';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const DynamicEditCityModal = dynamic(() => import('@/components/Modal/Country/EditCityModal'), {
    ssr: false,
});

export default function CityTable() {
    const [citiesData, setCitiesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCityId, setSelectedCityId] = useState(null);

    // GET DATA
    const fetchCities = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getCities();
            setCitiesData(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCities();
    }, [fetchCities]);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getCities();
        setCitiesData(data);
    }, []);

    // DIALOG OPEN AND CLOSE
    const handleEditOpenModal = (id) => {
        setOpenEdit(true);
        setSelectedCityId(id);
    };
    const handleEditCloseModal = () => {
        setOpenEdit(false);
        setSelectedCityId(null);
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
                    await refreshTable();
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'La ciudad ha sido eliminado.',
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
                        className="text-[12px] font-normal leading-[13px] text-[#8D8989] 2xl:text-[12px]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Nombre Ciudad
                        <ArrowUpDown className="ml-2 h-[14px] w-[14px]" />
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
                    <BtnEditTable onClick={() => handleEditOpenModal(row.original.id)} />
                    <BtnDeleteTable onClick={() => handleDelete(row.original.id)} />
                </div>
            ),
        },
    ];

    // Exportación de Archivo Excel
    const exportToExcel = async () => {
        try {
            const combinedData = citiesData.map((city) => ({
                countryCode: city.countryCode,
                countryName: city.country.name,
                cityName: city.name,
            }));
            // Crear hoja de trabajo a partir de los datos combinados
            const worksheet = XLSX.utils.json_to_sheet(combinedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Ciudades');
            // Exportar archivo Excel
            XLSX.writeFile(workbook, 'ciudades_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">Ciudades</h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewCityModal refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={citiesData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openEdit && setSelectedCityId && (
                <DynamicEditCityModal
                    id={selectedCityId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
