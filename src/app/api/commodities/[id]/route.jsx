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

        const viewCommodities = await prisma.commodities.findUnique({
            where: { id },

            select: {
                id: true,
                name: true,
                nameEnglish: true,
                dangerous: true,
                perishable: true,
                tariffPositional: true,
                commoditiesSectionId: true,
            },
        });

        if (!viewCommodities) {
            return notFound();
        }

        // Forzar revalidación
        revalidatePath(`/api/commodities/${params.id}`);

        const response = NextResponse.json(viewCommodities);
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
        return NextResponse.json({ error: 'Error fetching:' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const { id } = params;

        const updateCommodities = await prisma.commodities.update({
            where: { id },
            data: data,
        });

        // Forzar revalidación
        revalidatePath(`/api/commodities/${params.id}`);

        const response = NextResponse.json(updateCommodities);
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
        const { id } = params;

        const deleteCommodities = await prisma.commodities.delete({
            where: { id },
        });

        const response = NextResponse.json(deleteCommodities);
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
