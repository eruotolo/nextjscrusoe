'use client';

import useAuthStore from '@/store/authStore';

export default function SetNameLogin() {
    const session = useAuthStore((state) => state.session);

    return (
        <>
            <div className="hidden flex-col md:flex">
                <span className="block text-sm font-semibold text-gray-700">
                    {session && session.user
                        ? session.user.name + ' ' + session.user.lastName
                        : 'Cargando...'}
                </span>
                <p className="text-[12px] leading-[12px]">
                    {session && session.user && session.user.roles && session.user.roles.length > 0
                        ? session.user.roles.join(', ')
                        : 'Cargando...'}
                </p>
            </div>
        </>
    );
}
