import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const viewRole = await prisma.role.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                state: true,
            },
        });

        if (!viewRole) {
            notFound();
        }
        // Forzar revalidación
        revalidatePath(`/api/roles/${params.id}`);

        const response = NextResponse.json(viewRole);
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
        const { id } = params;

        const data = await request.json();
        const roleUpdate = await prisma.role.update({
            where: { id },
            data: data,
        });

        // Forzar revalidación después de actualizar
        revalidatePath(`/api/roles/${params.id}`);

        const response = NextResponse.json(roleUpdate);
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
