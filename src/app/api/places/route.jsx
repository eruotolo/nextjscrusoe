import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    //return NextResponse.json({ message: 'Soy Un Moustro' });
    try {
        const getPlaces = await prisma.places.findMany({
            select: {
                id: true,
                name: true,
                address: true,
                country: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                    },
                },
                city: {
                    select: {
                        id: true,
                        name: true,
                        countryCode: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        // Revalidate the path
        revalidatePath('/api/places');

        // Set cache headers
        const response = NextResponse.json(getPlaces);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error fetching Places:', error);
        return NextResponse.json({ error: 'No se pudieron obtener los lugares' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        // Log the received data console.log('Received data:', data);

        // VALIDATE DATA
        if (
            !data.name ||
            !data.codeCountry ||
            !data.codeCity ||
            !data.address ||
            !data.latitude ||
            !data.longitude
        ) {
            return NextResponse.json(
                { message: 'Todos los campos son obligatorios.' },
                { status: 400 }
            );
        }

        const newPlaces = await prisma.places.create({
            data: {
                codeCountry: data.codeCountry,
                codeCity: data.codeCity,
                name: data.name,
                address: data.address,
                longitude: data.longitude,
                latitude: data.latitude,
            },
        });

        //console.log('Create new:', newPlaces);
        return NextResponse.json(newPlaces, { status: 201 });
    } catch (error) {
        console.error('Error creating:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
