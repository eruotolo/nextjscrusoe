'use client';

import { useEffect, useState, useCallback } from 'react';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import dynamic from 'next/dynamic';

import { deleteAirport, getAirports } from '@/services/setting/airportService';
import { BtnDeleteTable, BtnEditTable } from '@/components/BtnTable/BtnTable';
import { NewAirportModal } from '@/components/Modal/Airport/NewAirportModal';

import Swal from 'sweetalert2';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const DynamicEditAirportModal = dynamic(
    () => import('@/components/Modal/Airport/EditAirportModal'),
    { ssr: false }
);

export default function AirportTable() {
    const [airportData, setAirportData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedAirportId, setSelectedAirportId] = useState(null);

    // GET DATA
    const fetchAirports = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAirports();
            setAirportData(data);
        } catch (error) {
            console.error('Error fetching airports:', error);
            // Podrías mostrar un mensaje de error al usuario aquí
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAirports();
    }, [fetchAirports]);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getAirports();
        setAirportData(data);
    }, []);

    // DIALOG OPEN AND CLOSE
    const handleEditOpenModal = (id) => {
        setOpenEdit(true);
        setSelectedAirportId(id);
    };
    const handleEditCloseModal = () => {
        setOpenEdit(false);
        setSelectedAirportId(null);
    };

    // ELIMINAR AIRPORT
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
                const success = await deleteAirport(id);
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
                    text: 'El aeropuerto está a salvo :)',
                    icon: 'error',
                });
            }
        });
    }

    // COLUMNAS
    const columns = [
        {
            accessorKey: 'gcdiata',
            size: 120,
            header: 'IATA',
        },
        {
            accessorKey: 'geocode',
            size: 120,
            header: 'Geocode',
        },
        {
            accessorKey: 'name',
            size: 400,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[12px] font-medium leading-[13px] text-[#8D8989]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Nombre Aeropuerto
                        <ArrowUpDown className="ml-2 h-[14px] w-[14px]" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'country.code',
            size: 120,
            header: 'Código País',
        },
        {
            accessorKey: 'country.name',
            size: 250,
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

    const exportToExcel = async () => {
        try {
            const combinedData = airportData.map((airport) => ({
                geocode: airport.geocode,
                name: airport.name,
                gcdiata: airport.gcdiata,
                gcdicao: airport.gcdicao,
                latitude: airport.longitude,
                longitude: airport.longitude,
                countryCode: airport.countryCode,
            }));
            // Crear hoja de trabajo a partir de los datos combinados
            const worksheet = XLSX.utils.json_to_sheet(combinedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Airports');
            // Exportar archivo Excel
            XLSX.writeFile(workbook, 'airports_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                        Aeropuertos
                    </h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewAirportModal refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={airportData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openEdit && setSelectedAirportId && (
                <DynamicEditAirportModal
                    id={selectedAirportId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
