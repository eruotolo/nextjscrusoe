'use client';

import { useState } from 'react';
import { useSettingContext } from '@/context/SettingContext';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import EditRoleModal from '@/components/Modal/Roles/EditRoleModal';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

import { Trash2, View, FilePenLine, FileSpreadsheet, Check, X } from 'lucide-react';

export default function RoleTable() {
    const { roleData, updateRoles } = useSettingContext();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 7;

    // Filtrar Roles
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredRoles = roleData
        .filter((role) =>
            Object.values(role).some((value) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar por nombre de forma descendente

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

    // Desactivar Usuario Configuración de SweetAlert2
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
    });

    async function handleDelete(id) {
        swalWithBootstrapButtons
            .fire({
                title: '¿Estás seguro?',
                text: '¡No podrás revertir esta acción!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    await fetch(`/api/roles/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ state: 0 }),
                    });
                    updateRoles();
                    swalWithBootstrapButtons.fire({
                        title: '¡Desactivado!',
                        text: 'El rol ha sido desactivado.',
                        icon: 'success',
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire({
                        title: 'Cancelado',
                        text: 'El rol está a salvo :)',
                        icon: 'error',
                    });
                }
            });
    }

    // Exportación de Archivo Excel
    const exportToExcel = () => {
        // Crear datos de Roles
        const dataRole = roleData.map((role) => ({
            roleId: role.id,
            roleName: role.name,
        }));

        // Crear hoja de trabajo a partir de los datos combinados
        const worksheet = XLSX.utils.json_to_sheet(dataRole);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles');

        // Exportar archivo Excel
        XLSX.writeFile(workbook, 'roles.xlsx');
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-end">
                <Button
                    onClick={exportToExcel}
                    className="mb-4 h-[38] w-[150px] rounded-[10px] bg-verde text-[12px] font-normal hover:bg-gris 2xl:w-[150px]"
                >
                    Exportar a Excel
                    <FileSpreadsheet className="ml-[5px] h-[20px]" />
                </Button>
            </div>
            <Table className="w-full">
                <TableHeader className="bg-grisclaro">
                    <TableRow className="border-b-0 border-blanco">
                        <TableHead className="w-[240px] rounded-bl-[10px] rounded-tl-[10px] px-4 py-2 text-[12px] font-normal leading-[13px] 2xl:text-[13px]">
                            Nombre
                        </TableHead>

                        <TableHead className="px-4 py-2 text-[12px] font-normal leading-[13px] 2xl:text-[13px]">
                            Estado
                        </TableHead>

                        <TableHead className="rounded-br-[10px] rounded-tr-[10px] px-4 py-2 text-[12px] font-normal leading-[13px] 2xl:text-[13px]">
                            Acciones
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map((roles) => (
                        <TableRow key={roles.id} className="border-0">
                            <TableCell className="px-4 py-2 text-[12px] font-light leading-[13px] 2xl:text-[13px] 2xl:font-normal">
                                {roles.name}
                            </TableCell>

                            <TableCell className="px-4 py-2 text-[12px] font-light leading-[13px] 2xl:text-[13px] 2xl:font-normal">
                                {roles.state === 1 ? (
                                    <Check className="w-[18px] text-verde" />
                                ) : (
                                    <X className="w-[18px] text-red-600" />
                                )}
                            </TableCell>

                            <TableCell className="p-4 text-[12px] font-light leading-[13px] 2xl:text-[13px] 2xl:font-normal">
                                <div className="flex items-center space-x-3">
                                    <EditRoleModal id={roles.id} />

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-[18px] w-[18px] border-0 text-azul hover:bg-none hover:text-verde"
                                        onClick={() => handleDelete(roles.id)}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className={
                                currentPage === 1
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                        />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                onClick={() => setCurrentPage(index + 1)}
                                isActive={currentPage === index + 1}
                                className="cursor-pointer"
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className={
                                currentPage === totalPages
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
