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

        const viewShipsType = await prisma.shipsType.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });

        if (!viewShipsType) {
            notFound();
        }

        // Forzar revalidación
        revalidatePath(`/api/shipstype/${id}`);

        const response = NextResponse.json(viewShipsType);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error fetching shipstype:', error);
        return NextResponse.json({ error: 'Failed to fetch shipstype' }, { status: 500 });
    }
}
