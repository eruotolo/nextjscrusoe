import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const viewAirport = await prisma.airports.findUnique({
            where: { id },

            select: {
                id: true,
                geocode: true,
                name: true,
                gcdiata: true,
                gcdicao: true,
                latitude: true,
                longitude: true,
                codeCountry: true,
            },
        });

        if (!viewAirport) {
            notFound();
        }

        const response = NextResponse.json(viewAirport);

        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

        return response;
    } catch (error) {
        console.error('Error aeroport:', error);
        return NextResponse.json({ error: 'Error aeroport' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const { codeCountry, ...res } = data;

        const updateAirport = await prisma.airports.update({
            where: {
                id: params.id,
            },
            data: {
                ...res,
                country: {
                    connect: {
                        code: codeCountry,
                    },
                },
            },
        });

        return NextResponse.json(updateAirport);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update airport' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const removeAirport = await prisma.airports.delete({
            where: {
                id: params.id,
            },
        });

        return NextResponse.json(removeAirport);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update airport' }, { status: 500 });
    }
}
