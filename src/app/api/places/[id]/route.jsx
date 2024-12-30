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

        const viewPlaces = await prisma.places.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                address: true,
                zipCode: true,
                latitude: true,
                longitude: true,
                codeCountry: true,
                codeCity: true,
                contactName: true,
                contactEmail: true,
                contactPhone: true,
            },
        });

        if (!viewPlaces) {
            notFound();
        }

        // Forzar revalidación
        revalidatePath(`/api/places/${params.id}`);

        const response = NextResponse.json(viewPlaces);
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
        const { codeCountry, codeCity, ...res } = data;

        const updatePlaces = await prisma.places.update({
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
                city: {
                    connect: {
                        id: codeCity,
                    },
                },
            },
        });

        // Forzar revalidación
        revalidatePath(`/api/places/${params.id}`);

        const response = NextResponse.json(updatePlaces);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const removePlace = await prisma.places.delete({
            where: {
                id: params.id,
            },
        });

        const response = NextResponse.json(removePlace);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to delete' },
            {
                status: 500,
            }
        );
    }
}
