import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const viewCountry = await prisma.country.findUnique({
            where: { id },

            select: {
                id: true,
                code: true,
                name: true,
            },
        });

        if (!viewCountry) {
            notFound();
        }

        // Forzar revalidación
        revalidatePath(`/api/country/${params.id}`);

        const response = NextResponse.json(viewCountry);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error fetching:', error);
        return NextResponse.json({ error: 'Failed to fetch:' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();

        const countryUpdated = await prisma.country.update({
            where: {
                id: params.id,
            },
            data: data,
        });

        // Forzar revalidación
        revalidatePath(`/api/country/${params.id}`);

        const response = NextResponse.json(countryUpdated);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update country' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        // Primero, buscamos el país por su ID para obtener su código
        const country = await prisma.country.findUnique({
            where: { id: params.id },
            select: { id: true, code: true },
        });

        if (!country) {
            return NextResponse.json({ error: 'Country not found' }, { status: 404 });
        }

        // Ahora eliminamos el país usando tanto el id como el code
        const removeCountry = await prisma.country.delete({
            where: {
                id: params.id,
                code: country.code,
            },
        });

        const response = NextResponse.json(removeCountry);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error completo al eliminar el país:', error);
        return NextResponse.json(
            { error: error.message || 'An error occurred while deleting the country' },
            { status: 500 }
        );
    }
}
