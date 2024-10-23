import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    const cityView = await prisma.city.findUnique({
        where: {
            id: Number(params.id),
        },
    });
    return NextResponse.json(cityView);
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const cityUpdate = await prisma.city.update({
            where: {
                id: Number(params.id),
            },
            data: {
                name: data.name,
                countryCode: data.countryCode,
            },
        });
        return NextResponse.json(cityUpdate);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update city' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    //return NextResponse.json({ message: 'Soy Un Moustro' });
    const removeCity = await prisma.city.delete({
        where: {
            id: Number(params.id),
        },
    });
    return NextResponse.json(removeCity);
}
