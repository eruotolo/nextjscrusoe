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

        const viewShipOwner = await prisma.shipowner.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                code: true,
            },
        });

        if (!viewShipOwner) {
            notFound();
        }

        // Forzar revalidación
        revalidatePath(`/api/shipowner/${params.id}`);

        const response = NextResponse.json(viewShipOwner);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error fetching shipowner:', error);
        return NextResponse.json({ error: 'Failed to fetch shipowner' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();

        if (!data || typeof data !== 'object') {
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }

        const updateShipOwner = await prisma.shipowner.update({
            where: {
                id: params.id,
            },
            data: data,
        });

        // Forzar revalidación después de actualizar
        revalidatePath(`/api/shipowner/${params.id}`);

        const response = NextResponse.json(updateShipOwner);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error al actualizar el propietario del barco:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el propietario del barco' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const deleteShipOwner = await prisma.shipowner.delete({
            where: {
                id: params.id,
            },
        });

        const response = NextResponse.json(deleteShipOwner);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error al eliminar el propietario del barco:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el propietario del barco' },
            { status: 500 }
        );
    }
}
