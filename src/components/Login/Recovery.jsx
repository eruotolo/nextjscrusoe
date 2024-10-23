'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function RecoveryPassword() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('Email being sent:', email);
        if (!email) {
            setErrorMessage('El campo de email está vacío');
            return;
        }
        try {
            const res = await fetch('/api/recovery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            //console.log(res);

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Revisa tu correo para el nuevo password.',
                }).then(() => {
                    router.push('/login');
                });
            } else {
                setErrorMessage(
                    'Fallo en la solicitud de recuperación de contraseña, su correo no se encuentra en el sistema'
                );
            }
        } catch (error) {
            setErrorMessage(
                'Ocurrió un problema al enviar la solicitud de recuperación de contraseña',
                error
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
                <label htmlFor="email select-none">Email</label>
                <div className="relative max-w-xl">
                    <svg
                        className="absolute inset-y-0 left-3 my-auto h-6 w-6 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                    </svg>
                    <input
                        id={'email'}
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-[10px] border bg-[#FAF8F8] py-2 pl-12 pr-3 text-gray-500 shadow-sm outline-none focus:border-azul"
                    />
                </div>
                <Link href="/login" className="ml-auto inline-block text-sm underline">
                    Recuperaste tu password? Ingresar
                </Link>
            </div>

            <button
                type="submit"
                className="rounded-[10px] bg-azul from-azul to-verde px-5 py-3 text-white duration-150 hover:bg-gradient-to-r active:bg-gradient-to-r"
            >
                Recovery
            </button>

            {errorMessage && (
                <div className="mt-[30px] flex justify-center">
                    <p className="bg-rosa w-[300px] rounded-[10px] py-[4px] text-center text-[16px] text-red-600">
                        {errorMessage}
                    </p>
                </div>
            )}
        </form>
    );
}
