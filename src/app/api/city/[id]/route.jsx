import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function GET(request, { params }) {
    try {
        const viewCity = await prisma.city.findUnique({
            where: {
                id: Number(params.id),
            },
            select: {
                id: true,
                name: true,
                countryCode: true,
            },
        });

        if (!viewCity) {
            notFound();
        }

        // Forzar revalidación
        revalidatePath(`/api/city/${params.id}`);

        const response = NextResponse.json(viewCity);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error fetching :', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();

        // Validar datos de entrada
        if (!data.name || !data.countryCode) {
            return NextResponse.json(
                { message: 'El nombre y el código de país son obligatorios' },
                { status: 400 }
            );
        }

        const cityUpdate = await prisma.city.update({
            where: {
                id: Number(params.id),
            },
            data: {
                name: data.name,
                countryCode: data.countryCode,
            },
        });

        // Forzar revalidación
        revalidatePath(`/api/city/${params.id}`);

        const response = NextResponse.json(cityUpdate);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error al actualizar la ciudad:', error);

        // Verificar errores específicos de Prisma
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'Ya existe una ciudad con este nombre en el país' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Ocurrió un error al actualizar la ciudad' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    //return NextResponse.json({ message: 'Soy Un Moustro' });
    try {
        const removeCity = await prisma.city.delete({
            where: {
                id: Number(params.id),
            },
        });

        const response = NextResponse.json(removeCity);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting transport type' }, { status: 500 });
    }
}
