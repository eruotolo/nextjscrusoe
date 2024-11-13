'use client';

import Image from 'next/image';

import useAuthStore from '@/store/authStore';

export default function SetImageLogin() {
    const session = useAuthStore((state) => state.session);

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
