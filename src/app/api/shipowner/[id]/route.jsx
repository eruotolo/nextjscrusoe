import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

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

        const response = NextResponse.json(viewShipOwner);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

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

        return NextResponse.json(updateShipOwner);
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

        return NextResponse.json(deleteShipOwner);
    } catch (error) {
        console.error('Error al eliminar el propietario del barco:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el propietario del barco' },
            { status: 500 }
        );
    }
}
