import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

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

        if (!viewTransportType) {
            notFound();
        }

        const response = NextResponse.json(viewTransportType);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching transport type' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const updateTransportType = await prisma.transportType.update({
            where: {
                id: params.id,
            },
            data: data,
        });
        return NextResponse.json(updateTransportType);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating transport type' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const deleteTransportType = await prisma.transportType.delete({
            where: {
                id: params.id,
            },
        });
        return NextResponse.json(deleteTransportType);
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting transport type' }, { status: 500 });
    }
}
