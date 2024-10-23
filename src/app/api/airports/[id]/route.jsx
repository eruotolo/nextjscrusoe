import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    const viewAirport = await prisma.airports.findUnique({
        where: {
            id: Number(params.id),
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
        const { countryCode, ...res } = data;

        const updateAirport = await prisma.airports.update({
            where: {
                id: Number(params.id),
            },
            data: {
                ...res,
                country: {
                    connect: {
                        code: countryCode,
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
    const removeAirport = await prisma.airports.delete({
        where: {
            id: Number(params.id),
        },
    });
    return NextResponse.json(removeAirport);
}
