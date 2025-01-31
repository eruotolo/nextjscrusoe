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

        const viewTraffics = await prisma.traffics.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                nameEnglish: true,
                code: true,
                modifiedBy: true,
            },
        });

        if (!viewTraffics) {
            notFound();
        }

        // Forzar revalidación
        revalidatePath(`/api/traffics/${id}`);

        const response = NextResponse.json(viewTraffics);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const data = await request.json();
        console.log('Data API:', data);
        const updateTraffics = await prisma.traffics.update({
            where: { id },
            data: data,
        });

        // Forzar revalidación después de actualizar
        revalidatePath(`/api/traffics/${id}`);

        const response = NextResponse.json(updateTraffics);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error updating' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const deleteTraffics = await prisma.traffics.delete({
            where: { id },
        });

        const response = NextResponse.json(deleteTraffics);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting:' }, { status: 500 });
    }
}
