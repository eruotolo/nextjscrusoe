'use client';

import { useEffect, useState, useCallback } from 'react';
import { deleteShippingPort, getShippingPorts } from '@/services/shippingPortService';
import dynamic from 'next/dynamic';

import GenericTable from '@/components/TableGeneric/TableGeneric';

const DynamicNewShippingPortModal = dynamic(
    () => import('@/components/Modal/ShippingPorts/NewShippingPortModal'),
    {
        ssr: false,
        loading: () => <p>Cargando...</p>,
    }
);

const DynamicEditShippingPortModal = dynamic(
    () => import('@/components/Modal/ShippingPorts/EditShippingPortModal'),
    {
        ssr: false,
        loading: () => <p>Cargando...</p>,
    }
);

import Swal from 'sweetalert2';
import { Trash2, ArrowUpDown, Plus, FilePenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

export default function ShippingPortTable() {
    const [shippingPortData, setShippingPortData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openNew, setOpenNew] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedPortId, setSelectedPortId] = useState(null);

    // GET DATA
    const fetchShippingPorts = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getShippingPorts();
            setShippingPortData(data);
        } catch (error) {
            console.error('Error fetching shipping ports:', error);
            // Podrías mostrar un mensaje de error al usuario aquí
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShippingPorts();
    }, [fetchShippingPorts]);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getShippingPorts();
        setShippingPortData(data);
    }, []);

    // DIALOG OPEN CLOSE

    const handleNewOpenModal = () => setOpenNew(true);
    const handleNewCloseModal = () => setOpenNew(false);

    const handleEditOpenModal = (id) => {
        setSelectedPortId(id);
        setOpenEdit(true);
    };
    const handleEditCloseModal = () => {
        setOpenEdit(false);
        setSelectedPortId(null);
    };

    // DELETE SHIPPINGPORT
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
                const success = await deleteShippingPort(id);
                if (success) {
                    await refreshTable();
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El puerto ha sido eliminado.',
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

    // Columnas de la tabla
    const columns = [
        {
            accessorKey: 'unCode',
            size: 180,
            header: 'Port Code',
        },
        {
            accessorKey: 'name',
            size: 500,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[12px] font-normal leading-[13px] text-[#8D8989] 2xl:text-[13px]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Nombre Puerto
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
            size: 350,
            header: 'País',
        },
        {
            accessorKey: 'action',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <FilePenLine
                        onClick={() => handleEditOpenModal(row.original.id)}
                        className="h-[18px] w-[18px] cursor-pointer hover:text-verde"
                    />
                    <Trash2
                        className="h-[18px] w-[18px] cursor-pointer hover:text-verde"
                        onClick={() => handleDelete(row.original.id)}
                    />
                </div>
            ),
        },
    ];

    // Exportación de Archivo Excel
    const exportToExcel = async () => {
        try {
            const dataToExport = shippingPortData.map((shippingPorts) => ({
                countryCode: shippingPorts.country.code,
                countryName: shippingPorts.country.name,
                shippingPortsIdent: shippingPorts.regionNro,
                shippingPortsName: shippingPorts.name,
                shippingPortsLat: shippingPorts.latitude,
                shippingPortsLog: shippingPorts.longitude,
            }));
            console.log(dataToExport);
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'ShippingPorts');
            XLSX.writeFile(workbook, 'shippingports_export.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                        Listado de puertos
                    </h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    <button
                        onClick={handleNewOpenModal}
                        className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]"
                    >
                        Nuevo <Plus className="ml-[5px] h-3 w-3" />
                    </button>
                </div>
            </div>
            <div className="mt-[20px] flex">
                <GenericTable
                    columns={columns}
                    data={shippingPortData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openNew && (
                <DynamicNewShippingPortModal
                    open={openNew}
                    onClose={handleNewCloseModal}
                    refresh={refreshTable}
                />
            )}
            {openEdit && selectedPortId && (
                <DynamicEditShippingPortModal
                    id={selectedPortId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
