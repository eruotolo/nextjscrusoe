import Link from 'next/link';

export default function Unauthorized() {
    return (
        <div className="flex h-[90vh] flex-col items-center justify-center p-4">
            <h1 className="mb-4 text-3xl font-bold text-red-600">Acceso denegado</h1>
            <p className="mb-6 text-gray-700">
                Lo sentimos, pero no tienes permiso para ver esta página.
            </p>
            <Link
                href="/dashboard"
                className="mt-[20px] flex h-[45px] w-[220px] items-center justify-center rounded-[10px] border-0 bg-gris px-4 py-2 text-[16px] font-normal text-blanco transition hover:bg-grisclaro hover:text-gris disabled:opacity-50"
            >
                Regresar al Dashboard
            </Link>
        </div>
    );
}
