import Link from 'next/link';

import SetImageLogin from '@/components/Sidebar/SetImagenLogin';
import SetNameLogin from '@/components/Sidebar/SetNameLogin';
import NavMain from '@/components/Sidebar/NavMain';
import Image from 'next/image';
import MenuSetting from '@/components/Sidebar/MenuSetting';

export default function Sidebar() {
    const Logo = '/crusoe.svg';
    return (
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center gap-4 border-b bg-[#ffffff] px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <Image src={Logo} alt="Logo" width={550} height={58} priority={true} />
                </Link>
            </div>
            <div className="flex-1">
                <NavMain />
            </div>
            <div className="mt-auto">
                <MenuSetting />
                <div className="border-t px-4 py-[10px]">
                    <div className="flex items-center gap-x-4">
                        <SetImageLogin />
                        <div>
                            <Link
                                href="/setting/profile"
                                className="mt-px block text-xs text-gray-600 hover:text-indigo-600"
                            >
                                <SetNameLogin />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
