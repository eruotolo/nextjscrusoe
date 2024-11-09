import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    const viewPlaces = await prisma.places.findUnique({
        where: {
            id: params.id,
        },
        include: {
            country: true,
            city: true,
        },
    });
    return NextResponse.json(viewPlaces);
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const { codeCountry, codeCity, ...res } = data;

        const updatePlaces = await prisma.places.update({
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
                city: {
                    connect: {
                        id: codeCity,
                    },
                },
            },
        });
        return NextResponse.json(updatePlaces);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const removePlace = await prisma.places.delete({
            where: {
                id: params.id,
            },
        });
        return NextResponse.json(removePlace);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to delete' },
            {
                status: 500,
            }
        );
    }
}
