'use client';

import { useEffect, useState, useCallback } from 'react';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import dynamic from 'next/dynamic';

import { getPlaces, deletePlaces } from '@/services/placesService';
import { BtnDeleteTable, BtnEditTable, BtnViewTable } from '@/components/BtnTable/BtnTable';
import NewPlacesModal from '@/components/Modal/Places/NewPlacesModal';

import Swal from 'sweetalert2';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const DynamicEditPlacesModal = dynamic(() => import('@/components/Modal/Places/EditPlacesModal'), {
    ssr: false,
});

const DynamicViewPlacesModal = dynamic(() => import('@/components/Modal/Places/ViewPlacesModal'), {
    ssr: false,
});

export default function PlacesTable() {
    const [placesData, setPlacesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedPlacesId, setSelectedPlacesId] = useState(null);

    // GET DATA
    const fetchPlaces = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getPlaces();
            setPlacesData(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlaces();
    }, [fetchPlaces]);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getPlaces();
        setPlacesData(data);
    }, []);

    // DIALOG OPEN CLOSE
    const handleEditOpenModal = (id) => {
        setSelectedPlacesId(id);
        setOpenEdit(true);
    };
    const handleEditCloseModal = () => {
        setSelectedPlacesId(false);
        setOpenEdit(null);
    };

    const handleViewOpenModal = (id) => {
        setSelectedPlacesId(id);
        setOpenView(true);
    };
    const handleViewCloseModal = () => {
        setSelectedPlacesId(false);
        setOpenView(null);
    };

    // DELETE
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
                const success = await deletePlaces(id);
                if (success) {
                    await refreshTable();
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El lugar ha sido eliminado.',
                        icon: 'success',
                    });
                } else {
                    console.error('Error deleting shipping port');
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelado',
                    text: 'El puerto está a salvo :)',
                    icon: 'error',
                });
            }
        });
    }

    // COLUMNAS
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
                        Nombre del Lugar
                        <ArrowUpDown className="ml-2 h-[14px] w-[14px]" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'address',
            size: 300,
            header: 'Dirección',
        },
        {
            accessorKey: 'city.name',
            size: 150,
            header: 'Ciudad',
        },
        {
            accessorKey: 'country.name',
            size: 150,
            header: 'País',
        },
        {
            accessorKey: 'action',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <BtnViewTable onClick={() => handleViewOpenModal(row.original.id)} />
                    <BtnEditTable onClick={() => handleEditOpenModal(row.original.id)} />
                    <BtnDeleteTable onClick={() => handleDelete(row.original.id)} />
                </div>
            ),
        },
    ];

    const exportToExcel = async () => {
        try {
            const combinedData = placesData.map((places) => ({
                name: places.name,
                address: places.address,
                cityName: places.city.name,
                codeCountry: places.codeCountry,
                countryName: places.country.name,
                latitude: places.latitude,
                longitude: places.longitude,
            }));
            // Crear hoja de trabajo a partir de los datos combinados
            const worksheet = XLSX.utils.json_to_sheet(combinedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Places');
            // Exportar archivo Excel
            XLSX.writeFile(workbook, 'places_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">Lugares</h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewPlacesModal refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={placesData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openEdit && selectedPlacesId && (
                <DynamicEditPlacesModal
                    id={selectedPlacesId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
            {openView && selectedPlacesId && (
                <DynamicViewPlacesModal
                    id={selectedPlacesId}
                    open={openView}
                    onClose={handleViewCloseModal}
                />
            )}
        </>
    );
}
