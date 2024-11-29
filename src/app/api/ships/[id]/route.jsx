import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const viewShips = await prisma.ships.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                code: true,
                country: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                shipsType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                shipowner: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!viewShips) {
            notFound();
        }

        const response = NextResponse.json(viewShips);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching Ships' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const { id } = params;
        const updateShips = await prisma.ships.update({
            where: { id },
            data: data,
        });

        return NextResponse.json(updateShips);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating ships' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        const deleteShips = await prisma.ships.delete({
            where: { id },
        });

        return NextResponse.json(deleteShips);
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting ships' }, { status: 500 });
    }
}
