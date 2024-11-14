'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ButtonSubMenu({ urlButton, titleButton }) {
    const pathname = usePathname();
    return (
        <Link
            href={urlButton}
            className={`mb-[15px] flex h-[36px] w-[100px] items-center justify-center rounded-[10px] bg-gris text-[12px] font-normal shadow-lg 2xl:h-[44px] 2xl:w-[140px] 2xl:text-[14px] ${
                pathname === urlButton
                    ? 'bg-gris text-blanco'
                    : 'bg-white text-gris hover:bg-gris hover:text-blanco'
            }`}
        >
            {titleButton}
        </Link>
    );
}
