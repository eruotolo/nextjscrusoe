import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    //return NextResponse.json({ message: 'Soy Un Moustro' });
    try {
        const getShippingPort = await prisma.shippingPorts.findMany({
            include: {
                country: true,
            },
        });

        // Set cache headers
        const response = NextResponse.json(getShippingPort);
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return response;
    } catch (error) {
        console.error('Error fetching shippingports:', error);
        return NextResponse.json({ error: 'Failed to fetch shippingports' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        console.log('Received data:', data); // Log the received data
        const newShippingPort = await prisma.shippingPorts.create({
            data: {
                unCode: data.unCode,
                name: data.name,
                codeCountry: data.codeCountry,
                latitude: data.latitude,
                longitude: data.longitude,
            },
        });
        console.log('Created new shipping port:', newShippingPort); // Log the created shipping port

        // Revalidate the path
        revalidatePath('/api/shippingports');
        return NextResponse.json(newShippingPort, { status: 201 });
    } catch (error) {
        console.error('Error creating shipping port:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}