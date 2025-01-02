import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url); // Extraer los parámetros de consulta
        const countryCode = searchParams.get('country'); // Obtener el parámetro `country` si está presente

        let cities;

        if (countryCode) {
            // Filtrar las ciudades por código de país si se proporciona el parámetro
            cities = await prisma.city.findMany({
                where: {
                    countryCode: countryCode, // Filtrar por código de país
                },
                include: {
                    country: true,
                },
            });
        } else {
            // Si no se proporciona el parámetro `country`, devolver todas las ciudades
            cities = await prisma.city.findMany({
                select: {
                    id: true,
                    countryCode: true,
                    name: true,
                    country: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    name: 'asc',
                },
            });
        }

        revalidatePath('/api/city');

        const response = NextResponse.json(cities);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error city:', error);
        return NextResponse.json({ error: 'Failed to get cities' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        // Validación de datos
        if (!data.name || !data.countryCode) {
            return NextResponse.json(
                { error: 'Name and countryCode are required' },
                { status: 400 }
            );
        }

        // Verificar si ya existe una ciudad con el mismo nombre en el mismo país
        const existingCity = await prisma.city.findFirst({
            where: {
                countryCode: data.countryCode,
                name: data.name,
            },
        });

        if (existingCity) {
            return NextResponse.json(
                { error: 'A city with this name already exists in the selected country' },
                { status: 400 }
            );
        }

        const newCity = await prisma.city.create({
            data: {
                countryCode: data.countryCode,
                name: data.name.trim(),
            },
            include: {
                country: true,
            },
        });

        revalidatePath('/api/city');

        return NextResponse.json(newCity);
    } catch (error) {
        console.error('Error creating city:', error);

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'A city with this name already exists' },
                { status: 400 }
            );
        }

        if (error.code === 'P2003') {
            return NextResponse.json(
                { error: 'The specified country does not exist' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create city', details: error.message },
            { status: 500 }
        );
    }
}
