import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    const viewAirport = await prisma.airports.findUnique({
        where: {
            id: params.id,
        },
        include: {
            country: true,
        },
    });
    return NextResponse.json(viewAirport);
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
