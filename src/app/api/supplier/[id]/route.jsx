import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

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

        const response = NextResponse.json(viewSupplier);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

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

        return NextResponse.json(updateSupplier);
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

        return NextResponse.json(deleteSupplier);
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting transport type' }, { status: 500 });
    }
}
