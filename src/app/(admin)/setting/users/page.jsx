import UserTable from '@/components/Tables/Users/UserTable';
import RoleTable from '@/components/Tables/Users/RoleTable';

export default function UserPage() {
    return (
        <>
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
