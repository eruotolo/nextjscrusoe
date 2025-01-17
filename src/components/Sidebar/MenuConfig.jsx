'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const handleSignOut = async () => {
    console.log('Cerrando sesión...');
    await signOut();
    console.log('Sesión cerrada');
};

const MenuDrop = (props) => {
    const { children, items } = props;
    const [isOpened, setIsOpened] = useState(false);

    return (
        <div className="">
            <button
                className="flex w-full items-center justify-between rounded-lg p-2 text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100"
                onClick={() => setIsOpened(!isOpened)}
            >
                <div className="flex items-center gap-x-2">{children}</div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-5 w-5 duration-150 ${isOpened ? 'rotate-180' : ''}`}
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {isOpened ? (
                <ul className="mx-4 border-l px-2 text-sm font-medium">
                    {items.map((item, idx) => (
                        <li key={idx}>
                            <Link
                                href={item.href}
                                className="flex items-center gap-x-2 rounded-lg p-2 text-[14px] font-normal text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100"
                            >
                                {item.icon ? <div className="text-gray-500">{item.icon}</div> : ''}
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                ''
            )}
        </div>
    );
};

const nestedNavSetting = [
    { name: 'Usuarios', href: '/setting/users', icon: '' },
    { name: 'Socios Comerciales', href: 'javascript:void(0)', icon: '' },
    { name: 'Países', href: 'javascript:void(0)', icon: '' },
    { name: 'Aeropuertos', href: 'javascript:void(0)', icon: '' },
    { name: 'Puertos', href: 'javascript:void(0)', icon: '' },
    { name: 'Commodities/Mercaderías', href: 'javascript:void(0)', icon: '' },
    { name: 'Lugares', href: 'javascript:void(0)', icon: '' },
    { name: 'Buques', href: 'javascript:void(0)', icon: '' },
    { name: 'Tráficos', href: 'javascript:void(0)', icon: '' },
    { name: 'Incoterms', href: 'javascript:void(0)', icon: '' },
];

export default function MenuConfig() {
    return (
        <nav className="grid items-start px-2 pb-4 text-sm font-medium lg:px-4">
            <Link
                href="#"
                className="flex items-center gap-x-2 rounded-lg p-2 text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                </svg>
                Help
            </Link>
            <MenuDrop items={nestedNavSetting}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
                Configuración
            </MenuDrop>

            <Link
                href="/"
                className="flex items-center gap-x-2 rounded-lg p-2 text-gray-600 duration-150 hover:bg-gray-50 active:bg-gray-100"
                onClick={handleSignOut}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                </svg>
                Cerrar sesión
            </Link>
        </nav>
    );
}
