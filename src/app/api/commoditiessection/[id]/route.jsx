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

        const viewCommoditiesSection = await prisma.commoditiesSection.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });

        if (!viewCommoditiesSection) {
            notFound();
        }

        revalidatePath(`/api/commoditiessection/${params.id}`);

        const response = NextResponse.json(viewCommoditiesSection);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching:' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const updateCommoditiesSection = await prisma.commoditiesSection.update({
            where: {
                id: params.id,
            },
            data: data,
        });

        // Forzar revalidación después de actualizar
        revalidatePath(`/api/commoditiessection/${params.id}`);

        const response = NextResponse.json(updateCommoditiesSection);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error updating:' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const deleteCommoditiesService = await prisma.commoditiesSection.delete({
            where: {
                id: params.id,
            },
        });

        const response = NextResponse.json(deleteCommoditiesService);
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
