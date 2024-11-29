'use client';

import { useEffect, useState } from 'react';
import { getUsers } from '@/services/userService';
import dynamic from 'next/dynamic';

import GenericTable from '@/components/TableGeneric/TableGeneric';
import {
    BtnChangeTable,
    BtnChangePassTable,
    BtnEditTable,
    BtnViewTable,
    BtnAssignRole,
} from '@/components/BtnTable/BtnTable';

const DynamicNewUserModal = dynamic(() => import('@/components/Modal/Users/NewUserModal'), {
    ssr: false,
});

const DynamicChangeUserPassModal = dynamic(
    () => import('@/components/Modal/Users/ChangeUserPassModal'),
    { ssr: false }
);
const DynamicEditUserModal = dynamic(() => import('@/components/Modal/Users/EditUserModal'), {
    ssr: false,
});
const DynamicViewUserModal = dynamic(() => import('@/components/Modal/Users/ViewUserModal'), {
    ssr: false,
});
const DynamicAssignRoleModal = dynamic(
    () => import('@/components/Modal/Users/AssignRoleUserModal'),
    { ssr: false }
);

import Swal from 'sweetalert2';
import { Check, X, ArrowUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

export default function UserTable() {
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openNew, setOpenNew] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openAssignRole, setOpenAssignRole] = useState(false);
    const [openChangePass, setOpenChangePass] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const fetchUsers = async () => {
        const data = await getUsers();
        setUserData(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // REFRESH TABLE BEFORE UPDATE
    const refreshTable = async () => {
        const data = await getUsers();
        setUserData(data);
    };

    // DIALOG OPEN CLOSE
    const handleNewOpenModal = () => setOpenNew(true);
    const handleNewCloseModal = () => setOpenNew(false);

    const handleEditOpenModal = (id) => {
        setOpenEdit(true);
        setSelectedUserId(id);
    };
    const handleEditCloseModal = () => {
        setOpenEdit(false);
        setSelectedUserId(null);
    };

    const handleViewOpenModal = (id) => {
        setOpenView(true);
        setSelectedUserId(id);
    };
    const handleViewCloseModal = () => {
        setOpenView(false);
        setSelectedUserId(null);
    };

    const handleAssignRoleOpenModal = (id) => {
        setOpenAssignRole(true);
        setSelectedUserId(id);
    };
    const handleAssignRoleCloseModal = () => {
        setOpenAssignRole(false);
        setSelectedUserId(null);
    };

    const handleChangePassOpenModal = (id) => {
        setOpenChangePass(true);
        setSelectedUserId(id);
    };
    const handleChangePassCloseModal = () => {
        setOpenChangePass(false);
        setSelectedUserId(null);
    };

    // Desactivar o Activar Usuario Configuración de SweetAlert2
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
    });

    // CHANGE ESTADO
    async function handleUserStateChange(id, state) {
        const action = state === 1 ? 'activado' : 'desactivado';
        const confirmText =
            state === 1 ? '¡El usuario será activado!' : '¡No podrás revertir esta acción!';
        const successText = state === 1 ? '¡Activado!' : '¡Desactivado!';
        const successMessage =
            state === 1 ? 'El usuario ha sido activado.' : 'El usuario ha sido desactivado.';
        const cancelMessage =
            state === 1 ? 'El usuario no ha sido activado :)' : 'El usuario está a salvo :)';

        swalWithBootstrapButtons
            .fire({
                title: '¿Estás seguro?',
                text: confirmText,
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
                        body: JSON.stringify({ state }),
                    });
                    swalWithBootstrapButtons.fire({
                        title: successText,
                        text: successMessage,
                        icon: 'success',
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire({
                        title: 'Cancelado',
                        text: cancelMessage,
                        icon: 'error',
                    });
                }
            });
    }

    // COLUMNAS TABLA
    const columns = [
        {
            accessorKey: 'fullName',
            size: 240,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="text-[12px] font-normal leading-[13px] text-[#8D8989] 2xl:text-[12px]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Nombre
                        <ArrowUpDown className="ml-2 h-[14px] w-[14px]" />
                    </Button>
                );
            },
            cell: ({ row }) => `${row.original.name} ${row.original.lastName}`,
        },
        {
            accessorKey: 'email',
            size: 180,
            header: 'Email',
        },
        {
            accessorKey: 'phone',
            size: 180,
            header: 'Teléfono',
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => (
                <div>
                    {row.original.roles.length > 0
                        ? row.original.roles.map((role, index) => (
                              <span key={index} className="text-[12px] leading-[18px]">
                                  {role.role.name}
                                  {index < row.original.roles.length - 1 ? ', ' : ''}
                              </span>
                          ))
                        : 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: 'state',
            header: 'Estado',
            cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.original.state === 1 ? (
                        <Check className="w-[17px] text-verde" />
                    ) : (
                        <X className="w-[17px] text-red-600" />
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'action',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-3">
                    <BtnViewTable onClick={() => handleViewOpenModal(row.original.id)} />
                    <BtnEditTable onClick={() => handleEditOpenModal(row.original.id)} />
                    <BtnAssignRole onClick={() => handleAssignRoleOpenModal(row.original.id)} />
                    <BtnChangePassTable
                        onClick={() => handleChangePassOpenModal(row.original.id)}
                    />
                    {row.original.state === 1 ? (
                        <>
                            <BtnChangeTable
                                onClick={() => handleUserStateChange(row.original.id, 0)}
                            />
                        </>
                    ) : (
                        <>
                            <BtnChangeTable
                                onClick={() => handleUserStateChange(row.original.id, 1)}
                            />
                        </>
                    )}
                </div>
            ),
        },
    ];

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
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">Usuarios</h5>
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
                    data={userData}
                    loading={isLoading}
                    exportToExcel={exportToExcel}
                />
            </div>
            {openNew && (
                <DynamicNewUserModal
                    open={openNew}
                    onClose={handleNewCloseModal}
                    refresh={refreshTable}
                />
            )}
            {openChangePass && selectedUserId && (
                <DynamicChangeUserPassModal
                    id={selectedUserId}
                    refresh={refreshTable}
                    open={openChangePass}
                    onClose={handleChangePassCloseModal}
                />
            )}
            {openEdit && selectedUserId && (
                <DynamicEditUserModal
                    id={selectedUserId}
                    refresh={refreshTable}
                    open={openEdit}
                    onClose={handleEditCloseModal}
                />
            )}
            {openView && selectedUserId && (
                <DynamicViewUserModal
                    id={selectedUserId}
                    open={openView}
                    onClose={handleViewCloseModal}
                />
            )}
            {openAssignRole && selectedUserId && (
                <DynamicAssignRoleModal
                    id={selectedUserId}
                    open={openAssignRole}
                    refresh={refreshTable}
                    onClose={handleAssignRoleCloseModal}
                />
            )}
        </>
    );
}
