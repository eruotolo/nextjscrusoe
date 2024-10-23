'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { CircleHelp, Settings, LogOut } from 'lucide-react';

export default function MenuSetting() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        console.log('Cerrando sesión...');
        await signOut({ redirect: false });
        console.log('Sesión cerrada');
        router.push('/login');
    };

    return (
        <nav className="grid items-start px-2 pb-4 text-sm font-medium lg:px-4">
            <Link
                href="#"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted hover:text-primary ${pathname === '#' ? 'bg-muted text-gris' : 'text-gris'} `}
            >
                <CircleHelp className="h-4 w-4" />
                Help
            </Link>
            <Link
                href="/setting/users"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted hover:text-primary ${pathname === '/setting/users' ? 'bg-muted text-gris' : 'text-gris'} `}
            >
                <Settings className="h-4 w-4" />
                Setting
            </Link>
            <Link
                href="#"
                onClick={handleSignOut}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted hover:text-primary ${pathname === '#' ? 'bg-muted text-gris' : 'text-gris'} `}
            >
                <LogOut className="h-4 w-4" />
                Logout
            </Link>
        </nav>
    );
}
