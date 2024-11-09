import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

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
                include: {
                    country: true,
                },
            });
        }

        return NextResponse.json(cities);
    } catch (error) {
        console.error('Error city:', error);
        return NextResponse.json({ error: 'Failed to get cities' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newCity = await prisma.city.create({
            data: {
                name: data.name,
                countryCode: data.countryCode,
            },
        });
        return NextResponse.json(newCity);
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
