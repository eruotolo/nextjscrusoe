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

        const viewAirport = await prisma.airports.findUnique({
            where: { id },

            select: {
                id: true,
                geocode: true,
                name: true,
                gcdiata: true,
                gcdicao: true,
                latitude: true,
                longitude: true,
                codeCountry: true,
            },
        });

        if (!viewAirport) {
            notFound();
        }

        // Forzar revalidación
        revalidatePath(`/api/airports/${params.id}`);

        const response = NextResponse.json(viewAirport);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error aeroport:', error);
        return NextResponse.json({ error: 'Error aeroport' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const { codeCountry, ...res } = data;

        const updateAirport = await prisma.airports.update({
            where: {
                id: params.id,
            },
            data: {
                ...res,
                country: {
                    connect: {
                        code: codeCountry,
                    },
                },
            },
        });

        // Forzar revalidación
        revalidatePath(`/api/airports/${params.id}`);

        const response = NextResponse.json(updateAirport);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update airport' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const removeAirport = await prisma.airports.delete({
            where: {
                id: params.id,
            },
        });

        const response = NextResponse.json(removeAirport);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update airport' }, { status: 500 });
    }
}
