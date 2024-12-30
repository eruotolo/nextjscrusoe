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

        const viewIncoterms = await prisma.incoterms.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                code: true,
            },
        });

        if (!viewIncoterms) {
            notFound();
        }

        // Forzar revalidación
        revalidatePath(`/api/incoterms/${params.id}`);

        const response = NextResponse.json(viewIncoterms);
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
        const data = await request.json();
        const updateIncoterms = await prisma.incoterms.update({
            where: {
                id: params.id,
            },
            data: data,
        });

        // Forzar revalidación
        revalidatePath(`/api/incoterms/${params.id}`);

        const response = NextResponse.json(updateIncoterms);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error updating incoterms' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        // Eliminar relaciones asociadas
        await prisma.incotermsTransport.deleteMany({
            where: {
                incotermsId: params.id,
            },
        });

        const deleteIncoterms = await prisma.incoterms.delete({
            where: {
                id: params.id,
            },
        });

        const response = NextResponse.json(deleteIncoterms);
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
