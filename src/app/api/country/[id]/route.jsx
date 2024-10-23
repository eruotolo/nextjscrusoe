import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    const countryView = await prisma.country.findUnique({
        where: {
            id: Number(params.id),
        },
    });
    return NextResponse.json(countryView);
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();

        const countryUpdated = await prisma.country.update({
            where: {
                id: Number(params.id),
            },
            data: data,
        });

        return NextResponse.json(countryUpdated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update country' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const countryId = Number(params.id);

        if (isNaN(countryId)) {
            return NextResponse.json({ error: 'Invalid country ID' }, { status: 400 });
        }

        // Primero, buscamos el país por su ID para obtener su código
        const country = await prisma.country.findUnique({
            where: { id: countryId },
            select: { id: true, code: true },
        });

        if (!country) {
            return NextResponse.json({ error: 'Country not found' }, { status: 404 });
        }

        // Ahora eliminamos el país usando tanto el id como el code
        const removeCountry = await prisma.country.delete({
            where: {
                id: countryId,
                code: country.code,
            },
        });

        return NextResponse.json({
            message: 'Country and related records deleted successfully',
            country: removeCountry,
        });
    } catch (error) {
        console.error('Error completo al eliminar el país:', error);
        return NextResponse.json(
            { error: error.message || 'An error occurred while deleting the country' },
            { status: 500 }
        );
    }
}
