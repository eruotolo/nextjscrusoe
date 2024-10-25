'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import NewCountryModal from '@/components/Modal/Country/NewCountryModal';
import { BtnDeleteTable, BtnEditTable } from '@/components/BtnTable/BtnTable';
import { deleteCountry, getCountries } from '@/services/countryService';
import Swal from 'sweetalert2';
import { ArrowUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const DynamicEditCountryModal = dynamic(
    () => import('@/components/Modal/Country/EditCountryModal'),
    {
        ssr: false,
    }
);

export default function CountryTable() {
    const [countriesData, setCountriesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCountryId, setSelectedCountryId] = useState(null);

    // GET DATA
    const fetchCountries = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getCountries();
            setCountriesData(data);
        } catch (error) {
            console.error('Error fetching country:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getCountries();
        setCountriesData(data);
    }, []);

    // DIALOG OPEN AND CLOSE
    const handleEditOpenModal = (id) => {
        setOpenEdit(true);
        setSelectedCountryId(id);
    };
    const handleEditCloseModal = () => {
        setOpenEdit(false);
        setSelectedCountryId(null);
    };

    // DELETE COUNTRY
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
                const success = await deleteCountry(id);
                if (success) {
                    await refreshTable();
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'La pais ha sido eliminado.',
                        icon: 'success',
                    });
                } else {
                    console.error('Error deleting country');
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelado',
                    text: 'El país está a salvo :)',
                    icon: 'error',
                });
            }
        });
    }

    const columns = [
        {
            accessorKey: 'code',
            header: 'Código País',
            size: 130, // ancho deseado
        },
        {
            accessorKey: 'name',
            //header: 'Nombre',
            size: 330, // ancho deseado
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[12px] font-medium leading-[12px] text-[#8D8989] 2xl:text-[12px]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Nombre País
                        <ArrowUpDown className="ml-2 h-4 w-4" />
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

    // Exportación de Archivo Excel
    const exportToExcel = () => {
        const combinedData = countriesData.map((country) => ({
            countryId: country.id,
            countryCode: country.code,
            countryName: country.name,
        }));
        // Crear hoja de trabajo a partir de los datos combinados
        const worksheet = XLSX.utils.json_to_sheet(combinedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Paises');
        // Exportar archivo Excel
        XLSX.writeFile(workbook, 'countries_combined.xlsx');
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                        Listado de países
                    </h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <NewCountryModal refresh={refreshTable} />
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={countriesData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openEdit && setSelectedCountryId && (
                <DynamicEditCountryModal
                    id={selectedCountryId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
