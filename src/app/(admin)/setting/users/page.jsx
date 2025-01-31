import UserTable from '@/components/Tables/Setting/Users/UserTable';
import RoleTable from '@/components/Tables/Setting/Users/RoleTable';
import BreadCrumbSetting from '@/components/BreadCrumb/BreadCrumbSetting';

export default function UserPage() {
    return (
        <>
            <div>
                <BreadCrumbSetting title="Users/Roles" />
            </div>
            <div className="grid grid-cols-3">
                <div className="col-span-2 mr-[15px] rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <UserTable />
                </div>
                <div className="col-span-1 rounded-[10px] bg-[#ffffff] p-[30px] shadow-lg">
                    <RoleTable />
                </div>
            </div>
        </>
    );
}
