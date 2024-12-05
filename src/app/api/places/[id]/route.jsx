import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const viewPlaces = await prisma.places.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                address: true,
                zipCode: true,
                latitude: true,
                longitude: true,
                codeCountry: true,
                codeCity: true,
                contactName: true,
                contactEmail: true,
                contactPhone: true,
            },
        });

        if (!viewPlaces) {
            notFound();
        }

        const response = NextResponse.json(viewPlaces);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

        return response;
    } catch (error) {
        console.error('Error fetching:', error);
        return NextResponse.json({ error: 'Failed to fetch:' }, { status: 500 });
    }
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
