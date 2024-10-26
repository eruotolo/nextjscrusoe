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
