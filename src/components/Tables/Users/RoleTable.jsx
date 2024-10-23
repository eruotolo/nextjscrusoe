'use client';

import { useState, useEffect, useCallback } from 'react';
import { getRoles, changeStateRole } from '@/services/roleService';
import dynamic from 'next/dynamic';

import GenericTable from '@/components/TableGeneric/TableGeneric';
import { BtnEditTable, BtnChangeTable } from '@/components/BtnTable/BtnTable';

const DynamicNewRoleModal = dynamic(() => import('@/components/Modal/Roles/NewRoleModal'), {
    ssr: false,
});

const DynamicEditRoleModal = dynamic(() => import('@/components/Modal/Roles/EditRoleModal'), {
    ssr: false,
});

import Swal from 'sweetalert2';
import { Check, X, ArrowUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

export default function RoleTable() {
    const [roleData, setRoleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openNew, setOpenNew] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState(null);

    const fetchRoles = async () => {
        const data = await getRoles();
        setRoleData(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = useCallback(async () => {
        const data = await getRoles();
        setRoleData(data);
    }, []);

    // DIALOG OPEN CLOSE
    const handleNewOpenModal = () => setOpenNew(true);
    const handleNewCloseModal = () => setOpenNew(false);

    const handleEditOpenModal = (id) => {
        setOpenEdit(true);
        setSelectedRoleId(id);
    };
    const handleEditCloseModal = () => {
        setOpenEdit(false);
        setSelectedRoleId(null);
    };

    // CHANGE STATE
    const handleDelete = useCallback(
        async (id) => {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¡No podrás revertir esta acción!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            });

            if (result.isConfirmed) {
                const success = await changeStateRole(id);
                if (success) {
                    await refreshTable();
                    Swal.fire('¡Desactivado!', 'El rol ha sido desactivado.', 'success');
                } else {
                    console.error('Error change');
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelado', 'El rol está a salvo :)', 'error');
            }
        },
        [refreshTable]
    );

    // COLUMNAS TABLA
    const columns = [
        {
            accessorKey: 'name',
            size: 240,
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
            accessorKey: 'state',
            header: 'Estado',
            cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.original.state === 1 ? (
                        <Check className="w-[18px] text-verde" />
                    ) : (
                        <X className="w-[18px] text-red-600" />
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'action',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <BtnEditTable onClick={() => handleEditOpenModal(row.original.id)} />
                    <BtnChangeTable onClick={() => handleDelete(row.original.id)} />
                </div>
            ),
        },
    ];

    const exportToExcel = async () => {
        try {
            const dataToExport = roleData.map((role) => ({
                roleId: role.id,
                roleName: role.name,
                roleState: role.state,
            }));
            console.log(dataToExport);
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles');
            XLSX.writeFile(workbook, 'roles.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                        Listado de roles
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
                    data={roleData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openNew && (
                <DynamicNewRoleModal
                    open={openNew}
                    onClose={handleNewCloseModal}
                    refresh={refreshTable}
                />
            )}
            {openEdit && selectedRoleId && (
                <DynamicEditRoleModal
                    id={selectedRoleId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
        </>
    );
}
