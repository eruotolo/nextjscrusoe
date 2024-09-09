'use client';

import { useState } from 'react';
import { useSettingContext } from '@/context/SettingContext';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import ViewUserModal from '@/components/Modal/Users/ViewUserModal';
import EditUserModal from '@/components/Modal/Users/EditUserModal';
import AssignRoleUserModal from '@/components/Modal/Users/AssignRoleUserModal';
import ChangeUserPassModal from '@/components/Modal/Users/ChangeUserPassModal';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Trash2, FileSpreadsheet, Check, X } from 'lucide-react';

export default function UserTable() {
    const { userData, updateUsers } = useSettingContext();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 7;

    // Filtrar Usuarios
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredUsers = userData
        .filter((user) =>
            Object.values(user).some((value) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    // Paginación Usuarios
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Desactivar o Activar Usuario Configuración de SweetAlert2
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
                    await fetch(`/api/users/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ state: 0 }),
                    });
                    updateUsers();
                    swalWithBootstrapButtons.fire({
                        title: '¡Desactivado!',
                        text: 'El usuario ha sido desactivado.',
                        icon: 'success',
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire({
                        title: 'Cancelado',
                        text: 'El usuario está a salvo :)',
                        icon: 'error',
                    });
                }
            });
    }

    async function handleActivate(id) {
        swalWithBootstrapButtons
            .fire({
                title: '¿Estás seguro?',
                text: '¡El usuario será activado!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    await fetch(`/api/users/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ state: 1 }),
                    });
                    updateUsers();
                    swalWithBootstrapButtons.fire({
                        title: '¡Activado!',
                        text: 'El usuario ha sido activado.',
                        icon: 'success',
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire({
                        title: 'Cancelado',
                        text: 'El usuario no ha sido activado :)',
                        icon: 'error',
                    });
                }
            });
    }

    // Exportación de Archivo Excel
    const exportToExcel = () => {
        // Crear datos combinados de User, Role y UserRole
        const combinedData = userData.map((user) => ({
            userId: user.id,
            userName: `${user.name} ${user.lastName}`,
            userEmail: user.email,
            userPhone: user.phone,
            userAddress: user.address,
            userCity: user.city,
            roleId: user.roles[0]?.role?.id || 'N/A',
            roleName: user.roles[0]?.role?.name || 'N/A',
        }));

        // Crear hoja de trabajo a partir de los datos combinados
        const worksheet = XLSX.utils.json_to_sheet(combinedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users_Roles');

        // Exportar archivo Excel
        XLSX.writeFile(workbook, 'users_roles_combined.xlsx');
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-start justify-between">
                <Input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="h-[38px] max-w-sm rounded-[10px] border-0 bg-muted/40 px-[15px] py-[4px] text-[12px] text-[#8D8989] focus:ring-azul"
                />
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
                        <TableHead className="w-[180px] rounded-bl-[10px] rounded-tl-[10px] px-4 py-2 text-[12px] font-normal leading-[13px] 2xl:text-[13px]">
                            Nombre
                        </TableHead>
                        <TableHead className="px-4 py-2 text-[12px] font-normal leading-[13px] 2xl:text-[13px]">
                            Email
                        </TableHead>
                        <TableHead className="px-4 py-2 text-[12px] font-normal leading-[13px] 2xl:text-[13px]">
                            Teléfono
                        </TableHead>

                        <TableHead className="w-[200px]px-4 py-2 text-[12px] font-normal leading-[13px] 2xl:text-[13px]">
                            Role
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
                    {currentItems.map((users) => (
                        <TableRow key={users.id} className="border-0">
                            <TableCell className="px-4 py-2 text-[12px] font-light leading-[13px] 2xl:text-[13px] 2xl:font-normal">
                                {users.name} {users.lastName}
                            </TableCell>
                            <TableCell className="p4 text-[12px] font-light leading-[13px] 2xl:text-[13px] 2xl:font-normal">
                                {users.email}
                            </TableCell>
                            <TableCell className="p-4 text-[12px] font-light leading-[13px] 2xl:text-[13px] 2xl:font-normal">
                                {users.phone}
                            </TableCell>

                            <TableCell className="p-4 text-[12px] font-light leading-[18px] 2xl:text-[13px] 2xl:font-normal">
                                {users.roles.length > 0
                                    ? users.roles.map((role, index) => (
                                          <span key={index}>
                                              {role.role.name}
                                              {index < users.roles.length - 1 ? ', ' : ''}
                                          </span>
                                      ))
                                    : 'N/A'}
                            </TableCell>

                            <TableCell className="p-4 text-[12px] font-light leading-[13px] 2xl:text-[13px] 2xl:font-normal">
                                {users.state === 1 ? (
                                    <Check className="w-[18px] text-verde" />
                                ) : (
                                    <X className="w-[18px] text-red-600" />
                                )}
                            </TableCell>

                            <TableCell className="p-4 text-[12px] font-light leading-[13px] 2xl:text-[13px] 2xl:font-normal">
                                <div className="flex items-center space-x-3">
                                    <ViewUserModal id={users.id} />

                                    <EditUserModal id={users.id} />

                                    <AssignRoleUserModal id={users.id} />

                                    <ChangeUserPassModal id={users.id} />

                                    {users.state === 1 ? (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(users.id)}
                                            className="h-[18px] w-[18px] border-0 text-azul hover:bg-none hover:text-verde"
                                        >
                                            <Trash2 />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleActivate(users.id)}
                                            className="h-[18px] w-[18px] border-0 text-azul hover:bg-none hover:text-verde"
                                            data-tip="Activar"
                                        >
                                            <Check />
                                        </Button>
                                    )}
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
