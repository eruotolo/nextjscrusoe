'use client';

import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

export default function SetImageLogin() {
    const session = useAppContext();

    return (
        <>
            <Image
                src={`/profile/${
                    session && session.user ? session.user.image : '/perfil-default.jpg'
                }`}
                alt="Imagen Perfil Usuario"
                width={770}
                height={770}
                priority={true}
                className="h-[45px] w-[45px] rounded-full"
            />
        </>
    );
}
