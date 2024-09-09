'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpNarrowWide, FileSliders, Handshake, Home, ShoppingCart } from 'lucide-react';

export default function NavMain() {
    const pathname = usePathname();
    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted hover:text-primary ${pathname === '/dashboard' ? 'bg-muted text-gris' : 'text-gris'} `}
            >
                <Home className="h-4 w-4" />
                Principales
            </Link>
            <Link
                href="#"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${pathname === '#' ? 'bg-muted text-gris' : 'text-gris'} `}

                //className="text-primary bg-muted"
            >
                <ArrowUpNarrowWide className="h-4 w-4" />
                Ventas
            </Link>
            <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gris transition-all hover:bg-muted hover:text-gris"
            >
                <ShoppingCart className="h-4 w-4" />
                Compras
            </Link>

            <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gris transition-all hover:bg-muted hover:text-primary"
            >
                <Handshake className="h-4 w-4" />
                Operaciones
            </Link>
            <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gris transition-all hover:bg-muted hover:text-primary"
            >
                <FileSliders className="h-4 w-4" />
                Administración
            </Link>
        </nav>
    );
}
