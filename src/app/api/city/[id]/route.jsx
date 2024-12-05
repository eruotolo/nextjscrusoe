import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export async function GET(request, { params }) {
    try {
        const viewCity = await prisma.city.findUnique({
            where: {
                id: Number(params.id),
            },
            select: {
                id: true,
                name: true,
                countryCode: true,
            },
        });

        if (!viewCity) {
            notFound();
        }

        const response = NextResponse.json(viewCity);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

        return response;
    } catch (error) {
        console.error('Error fetching :', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();

        // Validar datos de entrada
        if (!data.name || !data.countryCode) {
            return NextResponse.json(
                { message: 'El nombre y el código de país son obligatorios' },
                { status: 400 }
            );
        }

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
        console.error('Error al actualizar la ciudad:', error);

        // Verificar errores específicos de Prisma
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'Ya existe una ciudad con este nombre en el país' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Ocurrió un error al actualizar la ciudad' },
            { status: 500 }
        );
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
