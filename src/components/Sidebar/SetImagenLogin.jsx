'use client';

import Image from 'next/image';

import useAuthStore from '@/store/authStore';

export default function SetImageLogin() {
    const session = useAuthStore((state) => state.session);
    //console.log(session);
    return (
        <>
            <Image
                src={`${
                    session && session.user
                        ? session.user.image
                        : 'https://res.cloudinary.com/crusoeproduccion/image/upload/v1737207089/profile/perfil-default.jpg'
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
