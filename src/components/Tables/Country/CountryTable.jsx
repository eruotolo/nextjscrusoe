'use client';

import { useEffect, useState } from 'react';
import { useSettingContext } from '@/context/SettingContext';
import GenericTable from '@/components/TableGeneric/TableGeneric';
import { deleteCountry } from '@/services/countryService';
import EditCountryModal from '@/components/Modal/Country/EditCountryModal';
import Swal from 'sweetalert2';
import { FilePenLine, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

export default function CountryTable() {
    const { countriesData, updateCountries } = useSettingContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Asegúrate de que las ciudades están disponibles y no están vacías
        if (countriesData && countriesData.length > 0) {
            setIsLoading(false);
        }
    }, [countriesData]);

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
                    updateCountries();
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
                        className="text-[12px] font-normal leading-[13px] text-[#8D8989] 2xl:text-[13px]"
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
                    <EditCountryModal id={row.original.id} />

                    <button onClick={() => handleDelete(row.original.id)}>
                        <Trash2 className="h-[18px] w-[18px] text-gris hover:text-verde" />
                    </button>
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
        <GenericTable
            columns={columns}
            data={countriesData}
            loading={isLoading}
            exportToExcel={exportToExcel}
        />
    );
}
