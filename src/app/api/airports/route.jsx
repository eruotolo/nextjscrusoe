import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request) {
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

        const newAirport = await prisma.airports.create({
            data: {
                code: data.code,
                name: data.name,
                latitude: data.latitude,
                longitude: data.longitude,
                codeCountry: data.codeCountry,
            },
        });

        console.log('Created new Airport:', newAirport);
        return NextResponse.json(newAirport);
    } catch (error) {
        console.error('Error creating shipping port:', error); // Log the error
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
