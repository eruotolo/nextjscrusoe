'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { Home, LineChart, Menu, Package, Package2, ShoppingCart, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SetImageLogin from '@/components/Sidebar/SetImagenLogin';
import SetNameLogin from '@/components/Sidebar/SetNameLogin';

const DynamicProfileView = dynamic(() => import('@/components/Modal/Profile/ViewProfileModal'), {
    ssr: false,
});

export default function Header() {
    const router = useRouter();
    const [openProfile, setOpenProfile] = useState(false);

    const handleSignOut = async () => {
        console.log('Cerrando sesión...');
        await signOut({ redirect: false });
        console.log('Sesión cerrada');
        router.push('/login');
    };

    // DIALOG OPEN CLOSE
    const handleProfileOpenModal = () => setOpenProfile(true);
    const handleProfileCloseModal = () => setOpenProfile(false);

    return (
        <>
            <header className="flex h-14 items-center gap-4 border-b bg-[#ffffff] px-4 lg:h-[60px] lg:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col">
                        <nav className="grid gap-2 text-lg font-medium">
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link
                                href="#"
                                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                            >
                                <Home className="h-5 w-5" />
                                Dashboard
                            </Link>
                            <Link
                                href="#"
                                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Orders
                                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                    6
                                </Badge>
                            </Link>
                            <Link
                                href="#"
                                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                            >
                                <Package className="h-5 w-5" />
                                Products
                            </Link>
                            <Link
                                href="#"
                                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                            >
                                <Users className="h-5 w-5" />
                                Customers
                            </Link>
                            <Link
                                href="#"
                                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                            >
                                <LineChart className="h-5 w-5" />
                                Analytics
                            </Link>
                        </nav>
                        <div className="mt-auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upgrade to Pro</CardTitle>
                                    <CardDescription>
                                        Unlock all features and get unlimited access to our support
                                        team.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button size="sm" className="w-full">
                                        Upgrade
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="w-full flex-1"></div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-[45px] w-[45px] rounded-full"
                        >
                            <SetImageLogin />
                            <span className="sr-only mr-[100px]">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <SetNameLogin />
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Link href="#" onClick={handleProfileOpenModal}>
                                Ver Perfil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="#">Cambiar password</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href="#" onClick={handleSignOut}>
                                Cerrar sesión
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
            {openProfile && (
                <DynamicProfileView open={openProfile} onClose={handleProfileCloseModal} />
            )}
        </>
    );
}
