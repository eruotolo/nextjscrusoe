import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const viewTransportType = await prisma.transportType.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });

        // Forzar revalidación
        revalidatePath(`/api/transporttype/${id}`);

        const response = NextResponse.json(viewTransportType);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching transport type' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const updatedTransportType = await prisma.transportType.update({
            where: {
                id: params.id,
            },
            data: data,
        });

        // Forzar revalidación después de actualizar
        revalidatePath(`/api/transporttype/${params.id}`);

        const response = NextResponse.json(updatedTransportType);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error updating transport type' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const deletedTransportType = await prisma.transportType.delete({
            where: {
                id: params.id,
            },
        });

        const response = NextResponse.json(deletedTransportType);
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
