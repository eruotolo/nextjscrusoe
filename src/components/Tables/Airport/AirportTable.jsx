'use client';

import { useEffect, useState } from 'react';
import { useSettingContext } from '@/context/SettingContext';

import GenericTable from '@/components/TableGeneric/TableGeneric';

import Swal from 'sweetalert2';
import { Trash2, ArrowUpDown, FilePenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

export default function AirportTable() {
    const { airportData, refreshAirport } = useSettingContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (airportData && airportData.length > 0) {
            setIsLoading(false);
        }
    }, [airportData]);

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
                        className="text-[12px] font-normal leading-[13px] text-[#8D8989] 2xl:text-[13px]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Nombre Aeropuerto
                        <ArrowUpDown className="ml-2 h-4 w-4" />
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
                    <FilePenLine className="h-[18px] w-[18px] hover:text-verde" />
                    <Trash2 className="h-[18px] w-[18px] hover:text-verde" />
                </div>
            ),
        },
    ];

    // Exportación de Archivo Excel
    const exportToExcel = async () => {
        try {
            const dataToExport = airportData.map((airports) => ({
                airportCode: airports.gcdiata,
                airportGeocode: airports.geocode,
                airportGcdicao: airports.gcdicao,
                airportName: airports.name,
                airportLatitude: airports.latitude,
                airportLongitude: airports.longitude,
                countryCode: airports.country.code,
                countryName: airports.country.name,
            }));
            console.log(dataToExport);
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'airports');
            XLSX.writeFile(workbook, 'airports_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <GenericTable
            columns={columns}
            data={airportData}
            loading={isLoading}
            exportToExcel={exportToExcel}
        />
    );
}
