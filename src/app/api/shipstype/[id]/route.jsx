import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

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

        const response = NextResponse.json(viewShipsType);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

        return response;
    } catch (error) {
        console.error('Error fetching shipstype:', error);
        return NextResponse.json({ error: 'Failed to fetch shipstype' }, { status: 500 });
    }
}
