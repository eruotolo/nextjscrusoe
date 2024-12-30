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

        const viewShips = await prisma.ships.findUnique({
            where: { id },

            select: {
                id: true,
                name: true,
                code: true,
                shipownerId: true,
                codeCountry: true,
                shipsTypeId: true,
            },
        });

        if (!viewShips) {
            return notFound();
        }

        // Forzar revalidación
        revalidatePath(`/api/ships/${id}`);

        const response = NextResponse.json(viewShips);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error fetching ship:', error);
        return NextResponse.json({ error: 'Error fetching ship' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();

        //console.log('Datos:', data);

        const { id } = params;
        const updateShips = await prisma.ships.update({
            where: { id },
            data: data,
        });

        // Forzar revalidación después de actualizar
        revalidatePath(`/api/ships/${params.id}`);

        const response = NextResponse.json(updateShips);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error updating ships' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        const deleteShips = await prisma.ships.delete({
            where: { id },
        });

        const response = NextResponse.json(deleteShips);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting ships' }, { status: 500 });
    }
}
