import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    //return NextResponse.json({ message: 'Soy Un Moustro' });
    try {
        const getShippingPort = await prisma.shippingPorts.findMany({
            select: {
                id: true,
                unCode: true,
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
                unCode: 'asc',
            },
        });

        revalidatePath('/api/shippingports');

        // Set cache headers
        const response = NextResponse.json(getShippingPort);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error fetching shippingports:', error);
        return NextResponse.json({ error: 'Failed to fetch shippingports' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        //console.log('Received data:', data); // Log the received data

        // VALIDATE DATA
        if (!data.name || !data.unCode || !data.latitude || !data.longitude || !data.codeCountry) {
            return NextResponse.json(
                { message: 'Todos los campos son obligatorios.' },
                { status: 400 }
            );
        }

        const newShippingPort = await prisma.shippingPorts.create({
            data: {
                unCode: data.unCode,
                name: data.name,
                codeCountry: data.codeCountry,
                latitude: data.latitude,
                longitude: data.longitude,
            },
        });

        return NextResponse.json(newShippingPort, { status: 201 });
    } catch (error) {
        console.error('Error creating shipping port:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
