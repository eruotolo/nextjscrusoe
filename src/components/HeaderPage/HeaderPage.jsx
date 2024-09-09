'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../public/crusoe-wh.svg';
import { CircleUser } from 'lucide-react';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';

export default function HeaderPage() {
    return (
        <div className="flex h-[100px] items-center justify-between">
            <div className="flex items-start justify-start p-0">
                <Image
                    src={Logo}
                    alt="Logo"
                    width={560}
                    height={60}
                    className="z-10 ml-[-70px] h-[40px]"
                />
            </div>
            <div className="flex">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/login" legacyBehavior passHref>
                                <NavigationMenuLink className="flex w-[150px] items-center border-0 text-[16px] font-light leading-[1.25em] text-blanco">
                                    <CircleUser className="mr-[5px]" />
                                    Iniciar sesión
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    );
}
