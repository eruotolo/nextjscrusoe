import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    //return NextResponse.json({ message: 'Soy Un Moustro' });
    try {
        const getAirports = await prisma.airports.findMany({
            include: {
                country: true,
            },
        });
        // Revalidate the path
        revalidatePath('/api/airports');

        // Set cache headers
        const response = NextResponse.json(getAirports);
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return response;
    } catch (error) {
        console.error('Error fetching Airports:', error);
        return NextResponse.json({ error: 'Failed to fetch Airports' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        console.log('Received data:', data);

        // Validar los datos de entrada
        if (!data.gcdiata || !data.name || !data.latitude || !data.longitude || !data.codeCountry) {
            return NextResponse.json(
                { message: 'Todos los campos son obligatorios.' },
                { status: 400 }
            );
        }

        const newAirport = await prisma.airports.create({
            data: {
                gcdiata: data.gcdiata,
                name: data.name,
                latitude: data.latitude,
                longitude: data.longitude,
                codeCountry: data.codeCountry,
            },
        });

        console.log('Created new Airport:', newAirport);
        // REVALIDATE PATH

        return NextResponse.json(newAirport);
    } catch (error) {
        console.error('Error creating shipping port:', error); // Log the error
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
