import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const viewSupplier = await prisma.supplierType.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });

        // Forzar revalidación
        revalidatePath(`/api/supplier/${params.id}`);

        const response = NextResponse.json(viewSupplier);
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
        const { id } = params;
        const data = await request.json();

        const updateSupplier = await prisma.supplierType.update({
            where: { id },
            data: data,
        });

        // Forzar revalidación después de actualizar
        revalidatePath(`/api/supplier/${params.id}`);

        const response = NextResponse.json(updateSupplier);
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
        const deleteSupplier = await prisma.supplierType.delete({
            where: {
                id: params.id,
            },
        });

        const response = NextResponse.json(deleteSupplier);
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
