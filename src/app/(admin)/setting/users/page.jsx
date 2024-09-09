import UserTable from '@/components/Tables/Users/UserTable';
import RoleTable from '@/components/Tables/Users/RoleTable';
import NewRoleModal from '@/components/Modal/Roles/NewRoleModal';
import NewUserModal from '@/components/Modal/Users/NewUserModal';

export default function User() {
    return (
        <>
            <div className="flex">
                <div className="mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <div className="flex h-auto justify-between">
                        <div>
                            <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                                Listado de usuarios
                            </h5>
                            <p className="text-[13px] text-muted-foreground">
                                Crear, Editar y Eliminar
                            </p>
                        </div>
                        <div>
                            <NewUserModal />
                        </div>
                    </div>

                    <div className="mt-[20px] flex">
                        <UserTable />
                    </div>
                </div>
                <div className="rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <div className="flex h-auto justify-between">
                        <div>
                            <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                                Listado de roles
                            </h5>
                            <p className="text-[13px] text-muted-foreground">
                                Crear, Editar y Eliminar
                            </p>
                        </div>
                        <div>
                            <NewRoleModal />
                        </div>
                    </div>
                    <div className="mt-[20px] flex">
                        <RoleTable />
                    </div>
                </div>
            </div>
        </>
    );
}
